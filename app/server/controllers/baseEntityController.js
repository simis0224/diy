var traverse = require('traverse');
var User = require('../models/User');
var userHelper = require('../helpers/userHelper.js');
var labels = require('../labels/labels');
var util = require('util');
var _ = require('lodash');
var errors = require('../constants/errors');

module.exports = BaseEntityController;

function BaseEntityController() {}

BaseEntityController.prototype.apiGetOne = function(req, res) {
  var id = traverse(req).get(['params','id']);

  if(!id) {
    res.json({
      success: 0,
      error: errors.INVALID_ID_ERROR
    });
    return;
  }

  that = this;
  this.getEntityModel()
    .findOne( { _id: id })
    .exec(function(err, item) {
      if(err) {
        console.error(err);
        res.json({
          success: 0,
          error: errors.INTERNAL_ERROR
        });
        return;
      }

      if(!item) {
        res.json({
          success: 0,
          error: errors.RECORD_DOES_NOT_EXIST_ERROR
        });
        return;
      }

      retItem = item.toObject();
      if(item.createdBy) {
        retItem.createdBy = userHelper.getUserById(item.createdBy);
      }

      that.hook_beforeSuccessReturnOnGetOne(retItem);

      res.json({
        success: 1,
        data: retItem
      });
    });
}

BaseEntityController.prototype.apiList = function(req, res) {
  var userId = traverse(req).get(['query','userId']);

  var query = {};
  if(userId) {
    query = {
      createdBy: userId
    };
    return;
  }

  this.getEntityModel()
    .find(query)
    .exec(function(err, items) {
      if(err) {
        console.error(err);
        res.json({
          success: 0,
          error: errors.INTERNAL_ERROR
        });
        return;
      }

      var retItems = [];
      _.forEach(items, function(item) {
        var retItem = item.toObject();
        if(item.createdBy) {
          retItem.createdBy = userHelper.getUserById(item.createdBy);
        }
        retItems.push(retItem);
      });

      res.json({
        success: 1,
        data: retItems
      });
    });
}

BaseEntityController.prototype.apiCreate = function(req, res, next) {
  var itemData = {
    createdBy: userHelper.getCurrentUser(req).id,
    createdDate: new Date(),
    lastModifedDate: new Date()
  };

  itemData = this.readItemDataFromRequestOnCreate(req, itemData);

  that = this;
  var newItem = new this.getEntityModel()(itemData);
  newItem.save(function(err, item) {
    if (err) {
      console.error(err);
      res.json({
        success: 0,
        error: errors.INTERNAL_ERROR
      });
      return;
    }
    res.json({
      success: 1,
      data: item
    });
  });
}

BaseEntityController.prototype.apiUpdate = function(req, res, next) {
  var itemData = {
    _id: traverse(req).get(['params','id']),
    lastModifiedDate: new Date()
  };

  itemData = this.readItemDataFromRequestOnUpdate(req, itemData);

  that = this;
  this.getEntityModel()
    .findOne( { _id: itemData._id })
    .exec(function (err, item) {
      if (err) {
        console.error(err);
        res.json({
          success: 0,
          error: errors.INTERNAL_ERROR
        });
        return;
      }

      if (!item) {
        res.json({
          success: 0,
          error: errors.RECORD_DOES_NOT_EXIST_ERROR
        });
        return;
      }

      if(item.createdBy && item.createdBy !== userHelper.getCurrentUser(req).id) {
        res.json({
          success: 0,
          error: errors.NO_PRIVILEGE_ERROR
        });
        return;
      }

      item.set(itemData);
      item.save(function (err, newItem) {
        if (err) {
          console.error(err);
          // TODO fix validation
          var error = errors.INTERNAL_ERROR;
          if (err.name === 'ValidationError') {
            var error = errors.FIELD_VALIDATION_ERROR;
          } else if (err.name === 'MongoError') {
            error = that.handleDBErrorOnUpdate(err, req);
          }

          res.json({
            success: 0,
            error: error
          });
          return;
        }

        res.json({
          success: 1
        });
      });
    }
  );
}

BaseEntityController.prototype.apiDelete = function(req, res, next) {
  var id = traverse(req).get(['params','id']);

  if(!id) {
    res.json({
      success: 0,
      error: errors.INTERNAL_ERROR
    });
    return;
  }

  that = this;
  this.getEntityModel()
    .findOne( { _id: id })
    .exec(function(err, item) {
      if(err) {
        console.error(err);
        res.json({
          success: 0,
          error: errors.INTERNAL_ERROR
        });
        return;
      }

      if(!item) {
        res.json({
          hasError: true,
          error: errors.RECORD_DOES_NOT_EXIST_ERROR
        });
        return;
      }

      if(!userHelper.getCurrentUser(req).isAdmin) {
        res.json({
          success: 0,
          error: errors.NO_PRIVILEGE_ERROR
        });
        return;
      }

      item.remove(function(err) {
        if(err) {
          res.json({
            success: 0,
            error: errors.INTERNAL_ERROR
          });
          return;
        }
        res.json({
          success: 1
        });
      });
    });
}


BaseEntityController.prototype.readItemDataFromRequestOnCreate = function(req, item) {
  _.forEach(this.getEntityModel().fields, function(field) {
    if(field.allowCreate && traverse(req).get(['body', field.name])) {
      item[field.name] = traverse(req).get(['body', field.name]);
    }
  });

  return item;
}

BaseEntityController.prototype.readItemDataFromRequestOnUpdate = function(req, item) {
  _.forEach(this.getEntityModel().fields, function(field) {
    if(field.allowUpdate && traverse(req).get(['body', field.name])) {
      item[field.name] = traverse(req).get(['body', field.name]);
    }
  });

  return item;
}

BaseEntityController.prototype.hook_beforeSuccessReturnOnGetOne = function(item) {
  return item;
}


/**
 * Methods below should be implemented in sub class
 */
BaseEntityController.prototype.getEntityModel = function() {}

BaseEntityController.prototype.getEntityName = function() {}

BaseEntityController.prototype.getEntityNameLabel = function() {}

BaseEntityController.prototype.handleDBErrorOnUpdate = function(err, req) {
  return errors.INTERNAL_ERROR;
}



