var traverse = require('traverse');
var _ = require('lodash');
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
