var express = require('express'),
    app = express(),
    jade = require('jade'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    LocalStrat = require('passport-local').Strategy;

var auth = require('./auth');
var web = require('./multicaster');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

app.use(cookieParser());
app.use(bodyParser());

passport.use(new LocalStrat(
  function(username,password,done){
    User.findOne({ username: username}, function (err,user){
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, {message : "Incorrect username"});
      }
      if (!user.validPassword(password)){
        return done(null, false, {messsage : "Incorrect password"});
      }
        return done(null,user);
     });
   }
));

app.get('/', function(req,res){
  res.render('index', {
      title: "Home",
      user: req.user
    });
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

function isLoggedIn(req,res,next){
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

app.listen(3000);

//auth.requestGoogleAuth();
//web.get('http://www.google.com/index.html');
