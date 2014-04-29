var traverse = require('traverse');
var User = require('../models/User');
var userHelper = require('../helpers/userHelper.js');
var labels = require('../labels/labels');
var util = require('util');

module.exports = BaseEntityController;

function BaseEntityController() {}

BaseEntityController.prototype.renderViewPage = function(req, res, next) {
  var id = this.getIdFromParamsOnViewPage(req);
  if(!id) {
    req.flash('message', labels.error.pageNotFound);
    res.render('view' + this.getEntityName(), {
      message: req.flash('message'),
      currentUser: userHelper.getCurrentUser(req)
    })
  }

  that = this;
  this.getEntityModel()
    .findOne(this.getViewPageQuery(id))
    .exec(function(err, item) {
      var message = req.flash('message');
      if (err) {
        console.error(err);
        message = labels.error.internalError;
      }

      if(!item) {
        message = util.format(labels.error.itemNotFound, that.getEntityNameLabel());
      }

      item = that.addExtraItemData(item);

      res.render('view' + that.getEntityName(), {
        message: message,
        item: item,
        currentUser: userHelper.getCurrentUser(req)
      });
    });
}

BaseEntityController.prototype.getViewPageQuery = function(id) {
  return { _id: id};
}

BaseEntityController.prototype.getIdFromParamsOnViewPage = function(req) {
  return traverse(req).get(['params','id']);
}

BaseEntityController.prototype.addExtraItemData = function(item) {
  return item;
}

/**
 * Methods below should be implemented in sub class
 */
BaseEntityController.prototype.getEntityModel = function() {}

BaseEntityController.prototype.getEntityName = function() {}

BaseEntityController.prototype.getEntityNameLabel = function() {}

