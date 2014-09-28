module.exports = function(app,passport){

  var User = require('./models/user')

  app.get('/', isLoggedIn, function(req,res){
    res.render('browse', {
      title: "Home",
      user: req.user,
      files: User.findOne({"email" : req.user}).files,
      path: []
    });
  });

  app.get('/auth', function(req,res){
    res.render('auth.html');
  });

  app.get('/auth2', function(req,res){
    res.render('auth2.html');
  });

  app.get('/login', function(req,res){
    res.render('login.html', {
      message : req.flash("error"),
    });
  });

  app.get('/logout', function(req,res){
    req.logout();
    req.redirect('/login');
  });
  /*app.get('/signup', function(req,res){
    res.render('signup.html', {
      message : req.flash("error"),
    });
  });*/

  app.get('/box', function(req,res){ res.render('box');});

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


  app.get('/cd', function(req,res){

  });

  app.get('/browse', function(req,res){
    res.render("browse.html");
  });

  app.get('/mkdir', function(req,res){

  });

  app.get('/rm', function(req,res){

  });

  app.get('/upload', function(req,res){

  });

  app.get('/move', function(req,res){

  });

};

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
