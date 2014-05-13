var LocalStrategy   = require('passport-local').Strategy;
var User = require('./models/User');
var labels = require('./labels/labels');
var traverse = require('traverse');
var util = require('util');
var userHelper = require('./helpers/userHelper');
var errors = require('./constants/errors');

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
              req.flash('loginMessage', labels.error.internalError);
              return;
            }

            if (user) {
              return done(null, false, req.flash('message', labels.user.usernameExists));
            } else {

              var userData = {
                email: email,
                username: username,
                password: User.generateHash(password),
                createdDate: new Date(),
                lastModifedDate: new Date()
              }

              var newUser = new User(userData);

              newUser.save(function(err, user) {
                if (err) {
                  // TODO fix validation
                  if (err.name === 'ValidationError') {
                    return done(null, false, req.flash('message', err.errors[Object.keys(err.errors)[0]].message));
                  } else {
                    throw err;
                  }
                }
                userHelper.updateCurrentUserInfo(req, user);
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
            return done(errors.USER_DOES_NOT_EXIST_ERROR);
          }

          if (!User.validatePassword(password, user.password)) {
            return done(errors.INCORRECT_PASSWORD_ERROR);
          }
          userHelper.updateUserInSession(req, user);
          return done(null, user);
        });
    }));
};