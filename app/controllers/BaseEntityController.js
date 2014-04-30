var traverse = require('traverse');
var User = require('../models/User');
var userHelper = require('../helpers/userHelper.js');
var labels = require('../labels/labels');
var util = require('util');

module.exports = BaseEntityController;

function BaseEntityController() {}

BaseEntityController.prototype.renderViewPage = function(req, res, next) {
  var param = this.getUrlParamOnViewPage(req);
  if(!param) {
    res.render('view' + this.getEntityName(), {
      message: labels.error.pageNotFound,
      currentUser: userHelper.getCurrentUser(req)
    })
  }

  that = this;
  this.getEntityModel()
    .findOne(this.getViewPageQuery(param))
    .exec(function(err, item) {
      var message = req.flash('message');
      if (err) {
        console.error(err);
        message = labels.error.internalError;
      }

      if(!item) {
        message = util.format(labels.error.itemNotFound, that.getEntityNameLabel());
      }

      item = that.addExtraItemDataOnViewPage(item);

      res.render('view' + that.getEntityName(), {
        message: message,
        item: item,
        currentUser: userHelper.getCurrentUser(req)
      });
    });
}

BaseEntityController.prototype.renderListPage = function(req, res, next) {
  var param = this.getUrlParamOnListPage(req);

  that = this;
  this.getEntityModel()
    .find(this.getListPageQuery(param))
    .exec(function(err, items) {
      var message = req.flash('message')
      if(err) {
        message = labels.error.internalError;
        console.log(err);
      }
      res.render('list' + that.getEntityName(), {
        message: message,
        items: items,
        currentUser: userHelper.getCurrentUser(req)
      })
    })
}

BaseEntityController.prototype.renderCreatePage = function(req, res, next) {
  var pageData = {
    currentUser: userHelper.getCurrentUser(req),
    message: req.flash('message')
  }

  pageData = this.addExtraPageDataOnNewPage(pageData);

  res.render('create' + this.getEntityName(), pageData);
}

BaseEntityController.prototype.renderEditPage = function(req, res, next) {
  var id = this.getUrlParamOnEditPage(req)
  if(!id) {
    res.render('edit' + this.getEntityName(), {
      message: labels.error.pageNotFound,
      currentUser: userHelper.getCurrentUser(req)
    })
  }

//  if(userHelper.getCurrentUser(req).username != username) {
//    res.redirect('/viewUser/' + username);
//    return;
//  }

  that = this;
  this.getEntityModel()
    .findOne( this.getEditPageQuery(id) )
    .exec(function(err, item) {
      var message = req.flash('message');
      if (err) {
        message = labels.error.internalError;
        console.error(err);
      }

      if(!item) {
        message = util.format(labels.error.itemNotFound, that.getEntityNameLabel());
      }

      var pageData = {
        message: message,
        item: item,
        currentUser: userHelper.getCurrentUser(req)
      }

      pageData = that.addExtraPageDataOnEditPage(pageData);

      res.render('edit' + that.getEntityName(), pageData);
    });
}


BaseEntityController.prototype.getViewPageQuery = function(param) {
  return { _id: param };
}

BaseEntityController.prototype.getListPageQuery = function(param) {
  if(param) {
    return { createdBy: param };
  } else {
    return {};
  }
}

BaseEntityController.prototype.getEditPageQuery = function(param) {
  return { _id: param };
}

BaseEntityController.prototype.getUrlParamOnViewPage = function(req) {
  return traverse(req).get(['params','id']);
}

BaseEntityController.prototype.getUrlParamOnListPage = function(req) {
  var username = traverse(req).get(['params','username']);
  return  traverse(userHelper.getUserByUsername(username)).get(['id']);
}

BaseEntityController.prototype.getUrlParamOnEditPage = function(req) {
  return traverse(req).get(['params','id']);
}

BaseEntityController.prototype.addExtraItemDataOnViewPage = function(item) {
  return item;
}

BaseEntityController.prototype.addExtraPageDataOnNewPage = function(pageData) {
  return pageData;
}

BaseEntityController.prototype.addExtraPageDataOnEditPage = function(pageData) {
  return pageData;
}

/**
 * Methods below should be implemented in sub class
 */
BaseEntityController.prototype.getEntityModel = function() {}

BaseEntityController.prototype.getEntityName = function() {}

BaseEntityController.prototype.getEntityNameLabel = function() {}

