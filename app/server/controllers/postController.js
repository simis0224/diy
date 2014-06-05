var traverse = require('traverse');
var Post = require('../models/Post');
var postLabels = require('../labels/labels').post;
var util = require('util');
var BaseEntityController = require('./baseEntityController');

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

PostController.prototype.readItemDataFromRequestOnCreate = function(req, item) {
  item.subject = traverse(req).get(['body','subject']);
  item.summary = traverse(req).get(['body','summary']);
  item.postImage = traverse(req).get(['body','postImage']);
  item.address = traverse(req).get(['body','address']);
  item.phone = traverse(req).get(['body','phone']);

  return item;
}

PostController.prototype.readItemDataFromRequestOnUpdate = function(req, item) {
  item.subject = traverse(req).get(['body','subject']);
  item.summary = traverse(req).get(['body','summary']);
  item.postImage = traverse(req).get(['body','postImage']);
  item.address = traverse(req).get(['body','address']);
  item.phone = traverse(req).get(['body','phone']);

  return item;
}
