var LocalStrategy   = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    process.nextTick(function() {

      User.findOne({ 'email' :  email }, function(err, user) {
        if (err) return done(err);

        if (user) {
          return done(null, false);
        } else {

          var newUser = new User();

          newUser.email    = email;
          newUser.password = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }

      });

    });

  }));

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
  },
  function(email,pass,done){
    console.log("Searching Database");
    User.findOne({'email' : email}, function(err,user){
      if (err) return done(err);
      if (!user){
        console.log("No user found");
        return done(null,false);
      }
      if (!user.validPassword(pass)){
        console.log("Pass does not match");
        return done(null,false);
      }
      console.log("Found user " + user.email);
      return done(null,user);
    });

  }));

};
