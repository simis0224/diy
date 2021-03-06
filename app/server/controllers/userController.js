var traverse = require('traverse');
var User = require('../models/User');
var userLabels = require('../labels/labels').user;
var util = require('util');
var BaseEntityController = require('./baseEntityController');
var labels = require('../labels/labels');
var errors = require('../constants/errors');

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

UserController.prototype.handleDBErrorOnUpdate = function(err, req) {
  if (err.code === 11001) { // mongodb unique index violation error
    return errors.USERNAME_OR_EMAIL_EXISTS_ERROR;
  } else {
    return errors.INTERNAL_ERROR;
  }
}

UserController.prototype.readItemDataFromRequestOnUpdate = function(req, itemData) {
  BaseEntityController.prototype.readItemDataFromRequestOnUpdate.call(this, req, itemData);
  if(itemData.password) {
    itemData.password = User.generateHash(itemData.password);
  }
  return itemData;
}

UserController.prototype.hook_beforeSuccessReturnOnGetOne = function(item) {
  delete item.password;
  return item;
}


