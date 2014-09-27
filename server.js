var express = require('express'),
    app = express(),
    mustache = require('mustache'),
    mustacheExpress = require('mustache-express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    LocalStrat = require('passport-local').Strategy,
    dropbox = require('dropbox'),
    flash = require('connect-flash');

var auth = require('./auth');
var web = require('./multicaster');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(express.static(__dirname+'/public'))
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});

app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'darudeandthesandstorms' })); 
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash());

/*passport.use(new LocalStrat(
  function(username,password,done){
    User.findOne({ username: username}, function (err,user){
      if (err) { return done(err); }
      if (!user) {
        console.log("Usr not found");
        return done(null, false, {login_msg : "Incorrect username"});
      }
      if (!user.validPassword(password)){
        console.log("Pass does not match");
        return done(null, false, {login_msg : "Incorrect password"});
      }
        return done(null,user);
     });
   }
));*/

require('./app/routes.js')(app,passport);

app.listen(3000);

//auth.requestGoogleAuth();
//web.get('http://www.google.com/index.html');
