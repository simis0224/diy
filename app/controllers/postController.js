var traverse = require('traverse');
var Post = require('../models/Post');
var postLabels = require('../labels/labels').post;
var util = require('util');
var BaseEntityController = require('./baseEntityController');
var CategoryEnum = require('../models/CategoryEnum');


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

PostController.prototype.addExtraItemDataOnViewPage = function(item) {
  if(item && item.category) {
    item.categoryInLabel = traverse(CategoryEnum.getEnumByDbValue(item.category)).get(['value', 'label']);
  }
  return item;
}

PostController.prototype.addExtraPageDataOnNewPage = function(pageData) {
  pageData.categories = CategoryEnum.enums;
  return pageData;
}

PostController.prototype.addExtraPageDataOnEditPage = function(pageData) {
  pageData.categories = CategoryEnum.enums;
  return pageData;
}

