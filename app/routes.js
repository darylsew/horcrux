module.exports = function(app,passport){

  var User = require('./models/user')
  var url = require('url');
  var apitokens = {};

  app.get('/', isLoggedIn, function(req,res){
    res.render('browse', {
      user: req.user,
      files: User.findOne({"email" : req.user}).files,
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
      // TODO request datas here right away

      // TODO interface, where to redirect to? the next auth thing?
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
    if (queryData.code) {
      req.session.onedrive = queryData.code;
      console.log("Got token from onedrive: " + req.seession.onedrive);
      // TODO request datas here right away

      // TODO interface, where to redirect to?
      res.render('login.html');
    } else {
      res.render('onedrive.html');
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

  app.post('/mkdir', function(req,res){

  });

  app.post('/rm', function(req,res){

  });

  app.post('/upload', function(req,res){

  });

  app.post('/move', function(req,res){

  });

};

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
