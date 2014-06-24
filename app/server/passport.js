var LocalStrategy   = require('passport-local').Strategy;
var User = require('./models/User');
var traverse = require('traverse');
var userHelper = require('./helpers/userHelper');
var errors = require('./constants/errors');
var WeiboStrategy = require('passport-weibo').Strategy;

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
              console.error(err);
              return done(errors.INTERNAL_ERROR);
            }

            if (user) {
              return done(errors.USERNAME_OR_EMAIL_EXISTS_ERROR);
            } else {

              var userData = {
                email: email,
                username: username,
                password: User.generateHash(password),
                createdDate: new Date(),
                lastModifiedDate: new Date()
              }

              var newUser = new User(userData);

              newUser.save(function(err, user) {
                if (err) {
                  // TODO fix validation
                  if (err.name === 'ValidationError') {
                    err.message = err.errors[Object.keys(err.errors)[0]].message;
                  }
                  return done(err);
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
            console.error(err);
            return done(errors.INTERNAL_ERROR);
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


  passport.use(new WeiboStrategy({
      clientID: '1342570005',
      clientSecret: '9c3460205c73bc41e32fbdf29b6b8b27',
      callbackURL: "/auth/weibo/callback",
      authorizationURL: "https://api.weibo.com/oauth2/authorize",
      tokenURL: "https://api.weibo.com/oauth2/access_token",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      User
        .findOne({ 'weibo.id': profile.id})
        .exec(function(err, user) {
          if (err) {
            console.error(err);
            return done(errors.INTERNAL_ERROR);
          }

          if (user) {
            userHelper.updateCurrentUserInfo(req, user);
            return done(null, user);
          } else {
            var userData = {
              username: profile.screen_name,
              profileImageUrl: profile.profile_image_url,
              weibo: {
                id: profile.id,
                screenName: profile.screen_name,
                profileImageUrl: profile.profile_image_url
              },
              createdDate: new Date(),
              lastModifiedDate: new Date()
            }

            var newUser = new User(userData);

            newUser.save(function(err, user) {
              if (err) {
                // TODO fix validation
                if (err.name === 'ValidationError') {
                  err.message = err.errors[Object.keys(err.errors)[0]].message;
                }
                return done(err);
              }
              userHelper.updateCurrentUserInfo(req, user);
              done(null, newUser);
            });
          }
        });
    }
  ));
};