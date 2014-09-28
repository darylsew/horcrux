module.exports = function(app,passport){

  var User = require('./models/user')
  var url = require('url');
  var https = require('https');
  var apitokens = {};
  var fs = require('fs');
  var exec = require('child_process').exec;
  var crypto = require('crypto');

  app.get('/', isLoggedIn, function(req,res){
    res.render('browse', {
      user: req.user,
      files: User.findOne({"email" : req.user}).files,
      path: [],
    });
  });

  app.get('/drive', function(req,res){
    res.render('drive.html');
  });

  app.get('/box', function(req,res){
    var queryData = url.parse(req.url, true).query;
    if (queryData.code) {
      req.session.box = queryData.code;
      console.log("Got token from box: " + req.session.box);
      // get free space, get whether there is a tree structure
      var options = {
        hostname: 'https://api.box.com/2.0/users/me',
        port: 80,
        path: '/',
        method: 'GET',
        headers: {"Authorization": "Bearer " + req.session.box}
      };

      var apireq = https.request(options, function(res) {
          console.log("box response: " + res.space_amount);
          req.session.onedrivefreespace = res.space_amount;
      });
      apireq.end();      

      res.render('login.html');
    } else {
      res.render('box.html');
    }
  });

  app.get('/dropbox', function(req,res){
    res.render('dropbox.html');
  });

  app.get('/onedrive', function(req,res){
    var queryData = url.parse(req.url, true).query;
    if (queryData.access_token) {
      req.session.onedrive = queryData.access_token;
      var options = {
        host: 'apis.live.net',
        path: '/v5.0/me/skydrive/quota?access_token=' + req.session.onedrive,
        method: 'GET'
      };
      var apireq = https.request(options, function(res) {
        res.on('data', function(d) {req.session.onedrivefreespace = JSON.parse(d.toString()).available;});
      }).on('error', function(e) {console.error(e);});
      apireq.end();

      uploadOneDrive(req.session.onedrive, 'helloworld.txt', 'helloworld');
      downloadOneDrive(req.session.onedrive, 'helloworld.txt');

      // TODO do the next thing
      res.render('dropbox.html');
    } else {
      if (!req.session.onedrived) { // hackity hack
        res.render('onedrive.html');
        req.session.onedrived = true;
      }
    }
  });

  app.get('/login', function(req,res){
    res.render('login.html', {
      message : req.flash("error"),
    });
  });

  app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/login');
  });

  /*app.get('/signup', function(req,res){
    res.render('signup.html', {
      message : req.flash("error"),
    });
  });*/

  app.post('/user_auth', function(req,res) {
    console.log("login: " + req.body.login);
    console.log("signup: " + req.body.signup);
    if (req.body.login){
      passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        successFlash : "Logged In!",
        failureFlash : "Incorrect Credentials"
      })(req,res);
    } else {
      passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/login',
        successFlash : "Sign Up Successful!",
        failureFlash : "Sign Up Unsuccessful: Email in Use?"
      })(req,res);
    }
  }, function(req,res){
    res.redirect('/', {user: req.user});
  });

  /*app.post('/create_acc', passport.authenticate('local-signup',{
    successRedirect: '/login',
    failureRedirect: '/signup',
    successFlash : "Signed Up!",
    failureFlash : "Not Valid Sign-Up Information"
  }));*/

  app.get('/browse', function(req,res){
    res.render("browse.html");
  });

    /**
     *  Object structure for Files/Folders
     *  Folder:
     *  {
     *    _type: "FOLDER"
     *    itema: ...
     *    itemb: ...
     *  }
     *
     *  File:
     *  {
     *    _type: "FILE"
     *    schema: <schema for file retrieval>
     *  }
     */
  function update(obj, is, val){
    if (is.length <= 1 && val !== undefined) return obj[is[0]] = val;
    else if (obj._type == "FILE") return obj;
    else return update(obj[is[0]],is.slice(1),val);
  }

  function remove(obj, is){
    if (is.length == 1) return delete obj[is[0]];
    else if (obj._type == "FILE" && is.length > 1) return obj;
    else return remove(obj[is[0]],is.slice(1));
  }

  app.post('/mkdir', function(req,res){
    var wd = req.body.path;
    var ft = update(req.body.files, wd, {_type: "FOLDER"});
    User.findOne({email: req.body.user}, function (err,doc){
      doc.files = ft;
      doc.save();
    });
    res.send({success: true, files: ft});
  });

  app.post('/rm', function(req,res){
    var ft = remove(req.body.files, req.body.path);
    User.findOne({email: req.body.user}, function (err,doc){
      doc.files = ft;
      doc.save;
    });
    res.send({success: true, files: ft});
  });

  app.post('/upload', function(req,res){
    console.log(req.body.file);
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename){
      var fstream;
      console.log("Uploading: " + filename);
      var path = __dirname+'/../uploads/'+filename;
      var shasum = crypto.createHash('sha1');
      fstream = fs.createWriteStream(path);
      shasum.update(filename);
      file.pipe(fstream);
      var hashed = shasum.digest('hex');
      fstream.on('close', function () {
        exec('split -a 1 -n 3 ' + path + ' uploads/' + hashed);
        res.redirect('/');
      });
      /*var ft = req.body.files;
      var wd = req.body.path;
      wd.push(filename);
      update(ft,wd,{_type: "FILE", sig: hashed});*/
    });
  });
/*
  app.post('/upload', function(req,res){
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename){
      console.log("Uploading: " + filename);
      var path = __dirname+'/../uploads/'+filename;
      var shasum = crypto.createHash('sha1');
      fstream = fs.createWriteStream(path);
      shasum.update(filename);
      file.pipe(fstream);
      var hashed = shasum.digest('hex');
      fstream.on('close', function () {
        exec('split -a 1 -n 3 ' + path + ' uploads/' + hashed);
        res.redirect('/');
      });
    });
  });
*/
  app.post('/mv', function(req,res){
    var loc = req.body.loc;
    var path = req.body.path;
    var name = path[path.length - 1];
    loc.push(name);
    var ft = req.body.files;
    var payload = path.reduce(function(obj,i){return obj[i]}, ft);
    remove(ft,path);
    update(ft,loc,payload);
    User.findOne({email: req.body.user}, function (err,doc){
      doc.files = ft;
      doc.save;
    });
    res.send({success: true, files: ft});
  });

};

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

bighashmap = {};

function uploadOneDrive(access_token, filepath, data) {
  var https = require('https');
  //PUT https://apis.live.net/v5.0/me/skydrive/files/
  var options = {
    host: 'apis.live.net',
    path: '/v5.0/me/skydrive/files/' + filepath + '?access_token=' + access_token,
    method: 'PUT'
  };

  var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    var location = res.headers['location'];
    var fileID = location.substring(27, location.length-1);
    console.log("storing " + filepath + " as " + fileID);
    bighashmap[filepath] = fileID;
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY: ' + chunk);
    });
  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  // write data to request body
  req.write(data);
  req.end();
}


function downloadOneDrive(access_token, filepath) {
  console.log("retrieving " + filepath + " as " + id);
  var id = bighashmap[filepath];
  var https = require('https');
  //GET https://apis.live.net/v5.0/file.a6b2a7e8f2515e5e.A6B2A7E8F2515E5E!126/content?access_token=ACCESS_TOKEN
  var options = {
    host: 'apis.live.net',
    path: '/v5.0/' + id + '/content?access_token=' + access_token,
    method: 'GET'
  };

  https.get(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    console.log("headers: ", res.headers);
    res.on('data', function(d) {
      process.stdout.write(d);
    });
  }).on('error', function(e) {
    console.error(e);
  });
}
