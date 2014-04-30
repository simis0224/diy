var traverse = require('traverse');
var User = require('../models/User');
var userHelper = require('../helpers/userHelper.js');
var labels = require('../labels/labels');
var util = require('util');

module.exports = BaseEntityController;

function BaseEntityController() {}

BaseEntityController.prototype.create = function(req, res, next) {
  var itemData = {
    createdBy: userHelper.getCurrentUser(req).id,
    createdDate: new Date(),
    lastModifedDate: new Date()
  };

  itemData = this.addItemDataOnCreate(req, itemData);

  that = this;
  var newItem = new this.getEntityModel()(itemData);
  newItem.save(function(err, item) {
    if (err) {
      console.error(err);
      req.flash('message', labels.error.internalError);
      // TODO pass itemData
      res.redirect('/edit' + that.getEntityName() + '/' + item._id);
      return;
    }
    req.flash('message', util.format(labels.crud.publishSuccessful, that.getEntityNameLabel()));
    res.redirect('/view' + that.getEntityName() + '/' + item._id);
  });
}

BaseEntityController.prototype.update = function(req, res, next) {
  var itemData = {
    _id: traverse(req).get(['body','id']),
    lastModifedDate: new Date()
  };

  itemData = this.addItemDataOnUpdate(req, itemData);

  that = this;
  this.getEntityModel()
    .findOne( { _id: itemData._id })
    .exec(function (err, item) {
      if (err) {
        console.error(err);
        req.flash('message', labels.error.internalError);
        res.redirect('/edit' + that.getEntityName() + '/' + itemData._id);
        return;
      }

      if (!item) {
        req.flash('message', util.format(labels.error.itemNotFound, that.getEntityNameLabel()));
        res.redirect('/edit' + that.getEntityName() + '/' + itemData._id);
        return;
      }

      if(item.createdBy !== userHelper.getCurrentUser(req).id) {
        req.flash('message', labels.error.noPrivilege);
        res.redirect('/view' + that.getEntityName() + '/' + itemData._id);
        return;
      }

      item.set(itemData);
      item.save(function (err, item) {
        if (err) {
          console.error(err);
          // TODO fix validation
          if (err.name === 'ValidationError') {
            req.flash('message', err.errors[Object.keys(err.errors)[0]].message);
          } else {
            req.flash('message', labels.error.internalError);
          }
          res.redirect('/edit' + that.getEntityName() + '/' + itemData._id);
          return;
        }
        req.flash('message', labels.post.updateSuccessful);
        res.redirect('/view' + that.getEntityName() + '/' + itemData._id);
      });
    }
  );
}


BaseEntityController.prototype.delete = function(req, res, next) {
  var id = traverse(req).get(['params','id']);

  if(!id) {
    req.flash('message', labels.error.internalError);
    res.redirect('/list' + this.getEntityName());
    return;
  }

  that = this;
  this.getEntityModel()
    .findOne( { _id: id })
    .exec(function(err, item) {
      if(err) {
        console.error(err);
        req.flash('message', labels.error.internalError);
        res.redirect('/view' + that.getEntityName() + '/' + id)
        return;
      }

      if(!item) {
        req.flash('message', labels.post.postNotFound);
        res.redirect('/view' + that.getEntityName() + '/' + id);
        return;
      }

      if(item.createdBy !== userHelper.getCurrentUser(req).id) {
        req.flash('message', labels.error.noPrivilege);
        res.redirect('/view' + that.getEntityName() + '/' + id);
        return;
      }

      item.remove(function(err) {
        if(err) {
          req.flash('message', labels.error.internalError);
          res.redirect('/view' + that.getEntityName() + '/' + id)
          return;
        }
        req.flash('message', util.format(labels.crud.deleteSuccessful, that.getEntityNameLabel()));
        res.redirect('/list' + that.getEntityName() + '/' + userHelper.getCurrentUser(req).username);
      });
    });
}

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

  var validationResult = this.validateBeforeFindOnEditPage(req, res, id);
  if(validationResult && validationResult.hasValidationError) {
    req.flash('message', labels.error.noPrivilege);
    res.redirect('/view' + this.getEntityName() + '/' + id);
    return;
  }


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

      var validationResult = that.validateAfterFindOnEditPage(req, res, item);
      if(validationResult && validationResult.hasValidationError) {
        req.flash('message', labels.error.noPrivilege);
        res.redirect('/view' + that.getEntityName() + '/' + id);
        return;
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

BaseEntityController.prototype.validateBeforeFindOnEditPage = function(req, res, id) {
  return {
    hasValidationError: false
  };
}

BaseEntityController.prototype.validateAfterFindOnEditPage = function(req, res, item) {
  return {
    hasValidationError: item.createdBy !== userHelper.getCurrentUser(req).id
  };
}

BaseEntityController.prototype.addItemDataOnCreate = function(req, item) {
  return item;
}

BaseEntityController.prototype.addItemDataOnUpdate = function(req, item) {
  return item;
}

/**
 * Methods below should be implemented in sub class
 */
BaseEntityController.prototype.getEntityModel = function() {}

BaseEntityController.prototype.getEntityName = function() {}

BaseEntityController.prototype.getEntityNameLabel = function() {}



