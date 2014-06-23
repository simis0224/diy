var User = require('./models/User');
var userHelper = require('./helpers/userHelper');
var errors = require('./constants/errors');


var weibo = require('weibo');
weibo.init('weibo', '1342570005', '9c3460205c73bc41e32fbdf29b6b8b27');

var oauth = weibo.oauth({
  loginPath: '/api/oauthLogin',
  logoutPath: '/api/oauthLogout',
  callbackPath: '/login/callback',
  blogtypeField: 'type',
  afterLogin: function (req, res, callback) {
    User
      .findOne({ 'weibo.id': req.session.oauthUser.id })
      .exec(function(err, user) {
        if (err) {
          console.error(err);
          return;
        }

        if (!user) {
          var userData = {
            username: req.session.oauthUser.screen_name,
            weibo: {
              screenName: req.session.oauthUser.screen_name,
              id: req.session.oauthUser.id,
              profileImageUrl: req.session.oauthUser.profile_image_url
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
              console.error(err);
              return;
            }
            userHelper.updateCurrentUserInfo(req, user);
            process.nextTick(callback);
          });
        } else {
          userHelper.updateCurrentUserInfo(req, user);
          process.nextTick(callback);
        }

        console.log(req.session.oauthUser.screen_name, 'login success');
      });
  },
  beforeLogout: function (req, res, callback) {
    console.log(req.session.oauthUser.screen_name, 'loging out');
    process.nextTick(callback);
  }
})

module.exports = oauth;
