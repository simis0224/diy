var traverse = require('traverse');
var Post = require('../models/Post');
var postLabels = require('../labels/labels').post;
var util = require('util');
var BaseEntityController = require('./baseEntityController');
var CategoryEnum = require('../enums/CategoryEnum');
var fs = require('fs');
var crypto = require('crypto');
var paths = require('../constants/paths');
const MATERIAL_NAME_REGEX = /materials_name*/;

module.exports = PostController;

function PostController() {
  BaseEntityController.call(this);
}

util.inherits(PostController, BaseEntityController);

PostController.prototype.getEntityModel = function() {
  return Post;
}

PostController.prototype.getEntityName = function() {
  return 'Post';
}

PostController.prototype.getEntityNameLabel = function() {
  return postLabels.name;
}

PostController.prototype.getIdFromParamsOnViewPage = function(req) {
  return traverse(req).get(['params','id']);
}

PostController.prototype.hook_afterFindBeforeRedirectOnViewPage = function(item) {
  if(item && item.category) {
    item.categoryInLabel = traverse(CategoryEnum.getEnumByDbValue(item.category)).get(['value', 'label']);
  }
  return item;
}

PostController.prototype.hook_afterFindBeforeRedirectOnCreatePage = function(pageData) {
  pageData.categories = CategoryEnum.enums;
  return pageData;
}

PostController.prototype.hook_afterFindBeforeRedirectOnEditPage = function(pageData) {
  pageData.categories = CategoryEnum.enums;
  return pageData;
}

PostController.prototype.addItemDataOnCreate = function(req, item) {
  item.subject = traverse(req).get(['body','subject']);
  item.category = traverse(req).get(['body', 'category']);
  item.summary = traverse(req).get(['body','summary']);
  item.postImage = traverse(req).get(['body','postImage']);
  item.materials = [];
  item.tools = [];

  Object.keys(req.body).forEach(function(key) {
      if(MATERIAL_NAME_REGEX.exec(key)) {
        var index = getParamIndex(key);
        var materialName = traverse(req).get(['body','materials_name_' + index]);
        var materialQuantity = traverse(req).get(['body','materials_quantity_' + index]);
        if(materialName) {
          item.materials.push({
            name: materialName,
            quantity: materialQuantity
          });
        }

        var toolName = traverse(req).get(['body','tools_name_' + index]);
        var toolQuantity = traverse(req).get(['body','tools_quantity_' + index]);
        if(toolName) {
          item.tools.push({
            name: toolName,
            quantity: toolQuantity
          });
        }
      }
    });

  return item;
}

PostController.prototype.addItemDataOnUpdate = function(req, item) {
  item.subject = traverse(req).get(['body','subject']);
  item.category = traverse(req).get(['body', 'category']);
  item.summary = traverse(req).get(['body','summary']);
  item.postImage = traverse(req).get(['body','postImage']);
  item.materials = [];
  item.tools = [];

  Object.keys(req.body).forEach(function(key) {
    if(MATERIAL_NAME_REGEX.exec(key)) {
      var index = getParamIndex(key);
      var materialName = traverse(req).get(['body','materials_name_' + index]);
      var materialQuantity = traverse(req).get(['body','materials_quantity_' + index]);
      if(materialName) {
        item.materials.push({
          name: materialName,
          quantity: materialQuantity
        });
      }

      var toolName = traverse(req).get(['body','tools_name_' + index]);
      var toolQuantity = traverse(req).get(['body','tools_quantity_' + index]);
      if(toolName) {
        item.tools.push({
          name: toolName,
          quantity: toolQuantity
        });
      }
    }
  });


  return item;
}

function getParamIndex(paramName) {
  return paramName.split('_')[2];
}

