var traverse = require('traverse');
var User = require('../models/User');
var userLabels = require('../labels/labels').user;
var util = require('util');
var BaseEntityController = require('./baseEntityController');
var userHelper = require('../helpers/userHelper.js');

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

UserController.prototype.getViewPageQuery = function(param) {
  return { username: param };
}

UserController.prototype.getEditPageQuery = function(param) {
  return { username: param };
}

UserController.prototype.getUrlParamOnViewPage = function(req) {
  return traverse(req).get(['params','username']);
}

UserController.prototype.getUrlParamOnEditPage = function(req) {
  return traverse(req).get(['params','username']);
}

UserController.prototype.validateBeforeFindOnEditPage = function(req, res, username) {
  return {
    hasValidationError: userHelper.getCurrentUser(req).username != username
  }
}

UserController.prototype.validateAfterFindOnEditPage = function(req, res, username) {
  return {
    hasValidationError: false
  }
}
