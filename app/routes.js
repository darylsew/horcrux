module.exports = function(app,passport){

  app.get('/', isLoggedIn, function(req,res){
    res.render('horcrux', {
      title: "Home",
      user: req.user,
      files: User.findOne({"email" : req.user}).files
    });
  });

  app.get('/auth', function(req,res){
    //console.log("This does not work, as auth is jade.");
    res.render('auth.html');
  });

  app.get('/auth2', function(req,res){
    res.render('auth2.html');
  });

  app.get('/login', function(req,res){
    res.render('login.html');
  });

  app.post('/user_auth',
      passport.authenticate('local-login',
        { successRedirect : '/',
          failureRedirect : '/login'})
      );

  app.post('/signup', passport.authenticate('local-signup',{
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash : true
  }));

  app.get('/cd', function(req,res){

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
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
