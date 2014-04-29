var traverse = require('traverse');
var User = require('../models/User');
var userHelper = require('../helpers/userHelper.js');
var labels = require('../labels/labels');
var util = require('util');
var _ = require('lodash');

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
        res.redirect('/editUser/' + user.username);
        return;
      }

      if (!user) {
        req.flash('message', labels.user.userNotFound);
        res.redirect('/viewUser/' + user.username);
        return;
      } else {
        var oldUser = user.toObject();
        user.set(userData);
        user.save(function (err, user) {
          if (err) {
            console.error(err);
            // TODO fix validation
            if (err.name === 'ValidationError') {
              req.flash('message', err.errors[Object.keys(err.errors)[0]].message);
            } else if (err.name === 'MongoError') {
              if (err.code === 11001) { // mongodb unique index violation error
                req.flash('message', labels.user.usernameExists);
              } else {
                req.flash('message', labels.error.internalError);
              }
            } else {
              req.flash('message', labels.error.internalError);
            }
            res.redirect('/editUser/' + oldUser.username);
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
      message: req.flash('message'),
      currentUser: userHelper.getCurrentUser(req)
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
        user: user,
        currentUser: userHelper.getCurrentUser(req)
      });
    });
}

function renderEditUserPage(req, res, next) {
  var username = traverse(req).get(['params','username']);
  if(!username) {
    req.flash('message', labels.error.pageNotFound);
    res.render('editUser', {
      message: req.flash('message'),
      currentUser: userHelper.getCurrentUser(req)
    })
  }

  if(userHelper.getCurrentUser(req).username != username) {
    res.redirect('/viewUser/' + username);
    return;
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
        user: user,
        currentUser: userHelper.getCurrentUser(req)
      });
    });
}

var logout = function(req, res, next) {
  userHelper.deleteUserInSession(req);
  req.logout();
  res.redirect('/');
}

module.exports.updateUser = updateUser;
module.exports.logout = logout;

module.exports.renderUserListPage = renderUserListPage;
module.exports.renderLoginPage = renderLoginPage;
module.exports.renderEditUserPage = renderEditUserPage;
module.exports.renderViewUserPage = renderViewUserPage;
module.exports.renderSignupPage = renderSignupPage;



