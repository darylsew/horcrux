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
    //http://cafedaydream.com/onedrive?code=65eb3a0f-3f55-3973-18f9-11cb7d821a9c
    var queryData = url.parse(req.url, true).query;
    console.log("url: " + req.url);
    if (queryData.access_token) {
      console.log(queryData);
      req.session.onedrive = queryData.access_token;
      console.log("Got token from onedrive: " + req.session.onedrive);
      var options = {
        host: 'apis.live.net',
        path: '/v5.0/me/skydrive/quota?access_token=' + req.session.onedrive,
        method: 'GET'
      };

      var apireq = https.request(options, function(res) {
          console.log("onedrive response: " + res.keys());
          req.session.onedrivefreespace = res.available;
      });
      apireq.end();

      res.render('dropbox.html');
    } else {
      if (!req.session.onedrived) {
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
    var wd = req.query.path;
    var ft = update(req.query.files, wd, {_type: "FOLDER"});
    User.findOne({email: req.query.user}, function (err,doc){
      doc.files = ft;
      doc.save();
    });
  });

  app.post('/rm', function(req,res){
    var ft = remove(req.query.files, req.query.path);
    User.findOne({email: req.query.user}, function (err,doc){
      doc.files = ft;
      doc.save;
    });
  });

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

  app.post('/move', function(req,res){
    var loc = req.query.loc;
    var path = req.query.path;
    var name = path[path.length - 1];
    loc.push(name);
    var ft = req.query.files;
    var payload = path.reduce(function(obj,i){return obj[i]}, ft);
    remove(ft,path);
    update(ft,loc,payload);
    User.findOne({email: req.query.user}, function (err,doc){
      doc.files = ft;
      doc.save;
    });
  });

};

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
