var traverse = require('traverse');
var User = require('../models/User');
var userLabels = require('../labels/labels').user;
var util = require('util');
var BaseEntityController = require('./baseEntityController');
var userHelper = require('../helpers/userHelper.js');
var labels = require('../labels/labels');

module.exports = UserController;

function UserController() {
  BaseEntityController.call(this);
}

util.inherits(UserController, BaseEntityController);

UserController.prototype.getEntityModel = function() {
  return User;
}

UserController.prototype.getEntityName = function() {
  return 'User';
}

UserController.prototype.getEntityNameLabel = function() {
  return userLabels.name;
}

UserController.prototype.getUrlParamOnViewPage = function(req) {
  return getIdFromUrlParam(req);
}

UserController.prototype.getUrlParamOnEditPage = function(req) {
  return traverse(userHelper.getCurrentUser(req)).get(['id']);
}

UserController.prototype.getUrlParamOnViewPage = function(req) {
  return getIdFromUrlParam(req);
}

UserController.prototype.hook_afterSaveBeforeRedirectOnUpdate = function(req, item) {
  userHelper.updateCurrentUserInfo(req, item);
}

UserController.prototype.validateBeforeFindOnEditPage = function(req, res, id) {
  if (userHelper.getCurrentUser(req).id != id) {
    req.flash('message', labels.error.noPrivilege);
    res.redirect('/view' + this.getEntityName() + '/' + id);
    return {
      hasValidationError: true
    };
  }
  return {
    hasValidationError: false
  };
}

UserController.prototype.validateAfterFindOnEditPage = function(req, res, username) {
  return {
    hasValidationError: false
  }
}

UserController.prototype.hook_addItemDataOnUpdate = function(req, item) {
  item.email = traverse(req).get(['body','email']),
  item.username = traverse(req).get(['body','username'])
  var password = traverse(req).get(['body','password']);
  if(password) {
    item.password = User.generateHash(password);
  }
  return item;
}

UserController.prototype.getRedirectUrlParam = function(item) {
  return item.username;
}

UserController.prototype.handleDBErrorOnUpdate = function(err, req) {
  if (err.code === 11001) { // mongodb unique index violation error
    req.flash('message', labels.user.usernameExists);
  } else {
    req.flash('message', labels.error.internalError);
  }
}

UserController.prototype.addItemDataOnUpdate = function(req, itemData) {
  itemData.email = traverse(req).get(['body','email']);
  itemData.username = traverse(req).get(['body','username']);

  var password = traverse(req).get(['body','password']);
  if(password) {
    itemData.password = User.generateHash(password);
  }
  return itemData;
}

UserController.prototype.logout = function(req, res, next) {
  userHelper.deleteUserInSession(req);
  req.logout();
  res.redirect('/');
}

UserController.prototype.renderLoginPage = function(req, res, next) {
  res.render('login', {
    message: req.flash('message')
  });
}

function getIdFromUrlParam(req) {
  var username = traverse(req).get(['params','username']);
  var user = userHelper.getUserByUsername(username);
  return traverse(user).get(['id']);
}

