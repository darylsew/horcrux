module.exports = function(app,passport){

  app.get('/', isLoggedIn, function(req,res){
    res.render('horcrux', {
      title: "Home",
    user: req.user
    });
  });

  app.get('/auth', function(req,res){
    res.render('auth');
  });

  app.get('/login', function(req,res){
    res.render('login');
  });

  app.post('/user_auth',
      passport.authenticate('local',
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
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
