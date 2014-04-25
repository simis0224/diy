var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/User');
var Labels = require('../labels/Labels');
var traverse = require('traverse');

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
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {

      process.nextTick(function() {
        // username and password are default params. We can only get email from req.
        var email = traverse(req).get(['body','email']);

        User
          .findOne({ $or: [ { username: username }, { email: email } ] })
          .exec(function(err, user) {
            if (err) {
              return
            }

            if (user) {
              return done(null, false, req.flash('signupMessage', Labels.signUpMessage.usernameExists));
            } else {

              var userData = {
                email: email,
                username: username,
                password: User.generateHash(password),
                createdDate: new Date(),
                lastModifedDate: new Date()
              }

              var newUser = new User(userData);

              newUser.save(function(err) {
                if (err) {
                  // TODO fix validation
                  if (err.name === 'ValidationError') {
                    return done(null, false, req.flash('signupMessage', err.errors[Object.keys(err.errors)[0]].message));
                  } else {
                    throw err;
                  }
                }

                req.session.username = username;
                done(null, newUser);
              });
            }
          });
      });
    }));

  passport.use('local-login', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      User
        .findOne({ $or: [ { username: username}, { email: username } ] })
        .exec(function(err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
            return done(null, false, req.flash('loginMessage', Labels.loginMessage.userNotFound));
          }

          if (!User.validatePassword(password, user.password)) {
            return done(null, false, req.flash('loginMessage', Labels.loginMessage.wrongPassword));
          }

          req.session.username = user.username;
          return done(null, user);
        });
    }));
};