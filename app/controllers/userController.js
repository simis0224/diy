var traverse = require('traverse');
var User = require('../models/User');
var userLabels = require('../labels/labels').user;
var util = require('util');
var BaseEntityController = require('./baseEntityController');

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

UserController.prototype.getUrlParamOnViewPage = function(req) {
  return traverse(req).get(['params','username']);
}
