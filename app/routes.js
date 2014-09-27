module.exports = function(app,passport){

  app.get('/', function(req,res){
    res.render('index', {
      title: "Home",
    user: req.user
    });
  });

  app.get('/auth', function(req,res){
    res.render('auth');
  });

  app.post('/login',
      passport.authenticate('local',
        { successRedirect : '/',
          failureRedirect : true})
      );

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
