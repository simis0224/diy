var userHelper = require('../helpers/userHelper');
var labels = require('../labels/labels');
var util = require('util');
var errors = require('../constants/errors');

function AuthController() {}

AuthController.prototype.apiGetLoggedInUser = function(req, res) {
  res.send(req.isAuthenticated() ? { data: userHelper.getCurrentUser(req) }: '0');
}

AuthController.prototype.apiLogin = function(passport, req, res, next) {
  passport.authenticate('local-login',
    function (err, user, info) {
      if (err) {
        console.log(err);
        res.json({
          success: 0,
          error: err
        });
        return;
      }

      if (!user) {
        res.json({
          success: 0,
          error: errors.USER_DOES_NOT_EXIST_ERROR
        });
        return;
      }

      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          res.json({
            success: 0,
            error: errors.INTERNAL_ERROR
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

AuthController.prototype.apiSignup = function(passport, req, res, next) {
  passport.authenticate('local-signup',
    function (err, user, info) {
      if (err) {
        console.log(err);
        res.json({
          success: 0,
          error: err
        });
        return;
      }

      if (!user) {
        res.json({
          success: 0,
          // TODO
          error: errors.USER_DOES_NOT_EXIST_ERROR
        });
        return;
      }

      req.logIn(user, function (err) {
        if (err) {
          console.log(err);
          res.json({
            success: 0,
            error: errors.INTERNAL_ERROR
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

module.exports = AuthController;
