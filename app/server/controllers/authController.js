var userHelper = require('../helpers/userHelper');
var labels = require('../labels/labels');
var util = require('util');

function AuthController() {}

AuthController.prototype.apiGetLoggedInUser = function(req, res) {
  res.send(req.isAuthenticated() ? { data: userHelper.getCurrentUser(req) }: '0');
}

AuthController.prototype.apiLogin = function(passport, req, res, next) {
  passport.authenticate('local-login',
    function (err, user, info) {
      if (err) {
        res.json({
          success: 0,
          error: err
        });
        return;
      }

      if (!user) {
        res.json({
          success: 0,
          error: util.format(labels.error.itemNotFound, labels.user.name)
        });
        return;
      }

      req.logIn(user, function (err) {
        if (err) {
          res.json({
            success: 0,
            error: err
          });
          return;
        }

        return res.json({
          success: 1,
          data: {
            id: user.id,
            username: user.username
          }
        });
      });
    })(req, res, next);
}

AuthController.prototype.apiLogout = function(req, res, next) {
  userHelper.deleteUserInSession(req);
  req.logout();
  res.json({
    success: 1
  });
}

module.exports = AuthController;
