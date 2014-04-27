var traverse = require('traverse');
var User = require('../models/User');
var userHelper = require('../helpers/userHelper.js');
var labels = require('../labels/labels');
var util = require('util');

function updateUser(req, res, next) {
  var userData = {
    _id: traverse(req).get(['body','id']),
    email: traverse(req).get(['body','email']),
    username: traverse(req).get(['body','username'])
  };

  var password = traverse(req).get(['body','password']);
  if(password) {
    userData.password = User.generateHash(password);
  }

  User
    .findOne( { _id: userData._id })
    .exec(function (err, user) {
      if (err) {
        console.error(err);
        req.flash('message', labels.error.internalError);
        res.redirect('/editUser/' + userData.username);
      }

      if (!user) {
        req.flash('message', labels.user.userNotFound);
        res.redirect('/viewUser/' + userData.username);
      } else {

        user.set(userData);
        user.save(function (err, user) {
          if (err) {
            console.error(err);
            var message = "";
            // TODO fix validation
            if (err.name === 'ValidationError') {
              message = err.errors[Object.keys(err.errors)[0]].message;
            } else {
              console.error(err);
              req.flash('message', labels.error.internalError);
            }
            res.render('editUser', {
              user: userData,
              message: message
            });
            return;
          }
          userHelper.updateCurrentUserInfo(req, user);
          req.flash('message', labels.user.updateSuccessful);
          res.redirect('/editUser/' + user.username);
        });
      }
    }
  );
}

function renderSignupPage(req, res, next) {
  res.render('createUser', {
    message: req.flash('message')
  });
}

function renderLoginPage(req, res, next) {
  res.render('login', {
    message: req.flash('message')
  });
}

function renderUserListPage(req, res, next) {
  User
    .find()
    .exec(function(err, items) {
      var message = req.flash('message')
      if(err) {
        console.log(err);
      }
      res.render('listUsers', {
        message: message,
        users: items
      })
    })
}


function renderViewUserPage(req, res, next) {
  var username = traverse(req).get(['params','username']);
  if(!username) {
    req.flash('message', labels.error.pageNotFound);
    res.render('viewUser', {
      message: req.flash('message')
    })
  }

  User
    .findOne( { username: username })
    .exec(function(err, user) {
      var message = req.flash('message');
      if (err) {
        console.error(err);
        message = labels.error.internalError;
      }

      if(!user) {
        message = util.format(labels.user.userNotFound, username);
      }
      res.render('viewUser', {
        message: message,
        user: user
      });
    });
}

function renderEditUserPage(req, res, next) {
  var username = traverse(req).get(['params','username']);
  if(!username) {
    req.flash('message', labels.error.pageNotFound);
    res.render('editUser', {
      message: req.flash('message')
    })
  }

  if(userHelper.getCurrentUser(req).username != username) {
    res.redirect('/viewUser/' + username);
  }

  User
    .findOne( { username: username })
    .exec(function(err, user) {
      var message = req.flash('message');
      if (err) {
        console.error(err);
        message = labels.error.internalError;
      }

      if(!user) {
        message = util.format(labels.user.userNotFound, username);
      }
      res.render('editUser', {
        message: message,
        user: user
      });
    });
}

module.exports.updateUser = updateUser;

module.exports.renderUserListPage = renderUserListPage;
module.exports.renderLoginPage = renderLoginPage;
module.exports.renderEditUserPage = renderEditUserPage;
module.exports.renderViewUserPage = renderViewUserPage;
module.exports.renderSignupPage = renderSignupPage;


