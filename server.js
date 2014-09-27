var express = require('express'),
    app = express(),
    engines = require('consolidate'),
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

require('./config/passport')(passport);

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('view options', {layout: false});

app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'darudeandthesandstorms' })); 
app.use(passport.initialize());
app.use(passport.session()); 

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

require('./app/routes.js')(app,passport);

app.listen(3000);

//auth.requestGoogleAuth();
//web.get('http://www.google.com/index.html');
