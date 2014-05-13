var traverse = require('traverse');
var User = require('../models/User');
var userHelper = require('../helpers/userHelper.js');
var labels = require('../labels/labels');
var util = require('util');
var _ = require('lodash');
var errors = require('../constants/errors');

module.exports = BaseEntityController;

function BaseEntityController() {}

BaseEntityController.prototype.findOne = function(req, res) {
  var id = traverse(req).get(['params','id']);

  if(!id) {
    res.json({
      success: 0,
      error: errors.INVALID_ID_ERROR
    });
    return;
  }

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

      res.json({
        success: 1,
        data: retItem
      });
    });
}

BaseEntityController.prototype.find = function(req, res) {
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

  itemData = this.addItemDataOnCreate(req, itemData);

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
      res.redirect('/edit' + that.getEntityName() + '/' + that.getRedirectUrlParam(itemData));
      return;
    }
    req.flash('message', util.format(labels.crud.publishSuccessful, that.getEntityNameLabel()));
    res.redirect('/view' + that.getEntityName() + '/' + that.getRedirectUrlParam(item));
  });
}

BaseEntityController.prototype.update = function(req, res, next) {
  var itemData = {
    _id: traverse(req).get(['body','id']),
    lastModifiedDate: new Date()
  };

  itemData = this.addItemDataOnUpdate(req, itemData);

  that = this;
  this.getEntityModel()
    .findOne( { _id: itemData._id })
    .exec(function (err, item) {
      if (err) {
        console.error(err);
        req.flash('message', labels.error.internalError);
        res.redirect('/edit' + that.getEntityName() + '/' + that.getRedirectUrlParam(itemData));
        return;
      }

      if (!item) {
        req.flash('message', util.format(labels.error.itemNotFound, that.getEntityNameLabel()));
        res.redirect('/edit' + that.getEntityName() + '/' + that.getRedirectUrlParam(itemData));
        return;
      }

      if(item.createdBy && item.createdBy !== userHelper.getCurrentUser(req).id) {
        req.flash('message', labels.error.noPrivilege);
        res.redirect('/view' + that.getEntityName() + '/' + that.getRedirectUrlParam(itemData));
        return;
      }

      item.set(itemData);
      item.save(function (err, newItem) {
        if (err) {
          console.error(err);
          // TODO fix validation
          if (err.name === 'ValidationError') {
            req.flash('message', err.errors[Object.keys(err.errors)[0]].message);
          } else if (err.name === 'MongoError') {
            that.handleDBErrorOnUpdate(err, req);
          } else {
            req.flash('message', labels.error.internalError);
          }

          res.redirect('/edit' + that.getEntityName() + '/' + that.getRedirectUrlParam(item));
          return;
        }

        that.hook_afterSaveBeforeRedirectOnUpdate(req, item);

        req.flash('message', util.format(labels.crud.updateSuccessful, that.getEntityNameLabel()));
        res.redirect('/view' + that.getEntityName() + '/' + that.getRedirectUrlParam(item));
      });
    }
  );
}

BaseEntityController.prototype.apiUpdate = function(req, res, next) {
  var itemData = {
    _id: traverse(req).get(['params','id']),
    lastModifiedDate: new Date()
  };

  itemData = this.addItemDataOnUpdate(req, itemData);

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

        that.hook_afterSaveBeforeRedirectOnUpdate(req, item);

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

      if(item.createdBy !== userHelper.getCurrentUser(req).id) {
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

      item = that.hook_afterFindBeforeRedirectOnViewPage(item);

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
        items: items  ,
        currentUser: userHelper.getCurrentUser(req)
      })
    })
}

BaseEntityController.prototype.renderCreatePage = function(req, res, next) {
  var pageData = {
    currentUser: userHelper.getCurrentUser(req),
    message: req.flash('message')
  }

  pageData = this.hook_afterFindBeforeRedirectOnCreatePage(pageData);

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
        res.redirect('/view' + that.getEntityName() + '/' + that.getRedirectUrlParam(item));
        return;
      }

      var pageData = {
        message: message,
        item: item,
        currentUser: userHelper.getCurrentUser(req)
      }

      pageData = that.hook_afterFindBeforeRedirectOnEditPage(pageData);

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

BaseEntityController.prototype.hook_afterSaveBeforeRedirectOnUpdate = function(req, item) {}

BaseEntityController.prototype.hook_afterFindBeforeRedirectOnViewPage = function(item) {
  return item;
}

BaseEntityController.prototype.hook_afterFindBeforeRedirectOnCreatePage = function(pageData) {
  return pageData;
}

BaseEntityController.prototype.hook_afterFindBeforeRedirectOnEditPage = function(pageData) {
  return pageData;
}

BaseEntityController.prototype.validateBeforeFindOnEditPage = function(req, res, id) {
  return {
    hasValidationError: false
  };
}

BaseEntityController.prototype.validateAfterFindOnEditPage = function(req, res, item) {
  return {
    hasValidationError: item.createdBy && item.createdBy !== userHelper.getCurrentUser(req).id
  };
}

BaseEntityController.prototype.addItemDataOnCreate = function(req, item) {
  return item;
}

BaseEntityController.prototype.addItemDataOnUpdate = function(req, item) {
  return item;
}

BaseEntityController.prototype.getRedirectUrlParam = function(item) {
  return item._id;
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



