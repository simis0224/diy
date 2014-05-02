var traverse = require('traverse');
var Post = require('../models/Post');
var postLabels = require('../labels/labels').post;
var util = require('util');
var BaseEntityController = require('./baseEntityController');
var CategoryEnum = require('../models/CategoryEnum');
var fs = require('fs');
var crypto = require('crypto');
var paths = require('../constants/paths');
const MATERIAL_NAME_REGEX = /materialName*/;

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
  item.description = traverse(req).get(['body','description']);
  item.postImage = handleFileUpload(req);
  item.materials = [];
  item.tools = [];

  Object.keys(req.body).forEach(function(key) {
      if(MATERIAL_NAME_REGEX.exec(key)) {
        var index = getParamIndex(key);
        var materialName = traverse(req).get(['body','materialName_' + index]);
        var materialQuantity = traverse(req).get(['body','materialQuantity_' + index]);
        if(materialName) {
          item.materials.push({
            name: materialName,
            quantity: materialQuantity
          });
        }

        var toolName = traverse(req).get(['body','toolName_' + index]);
        var toolQuantity = traverse(req).get(['body','toolQuantity_' + index]);
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
  item.description = traverse(req).get(['body','description']);
  if(req.files && req.files.postImage && req.files.postImage.name)
  {
    item.postImage = handleFileUpload(req);
  }
  return item;
}

function handleFileUpload(req) {
  if(!req.files || !req.files.postImage || !req.files.postImage.name) {
    return req.body.currentPicture || '';
  }
  var data = fs.readFileSync(req.files.postImage.path);
  var fileName = req.files.postImage.name;
  var uid = crypto.randomBytes(10).toString('hex');
  var dir = paths.UPLOAD_IMAGE_DIR + uid;
  fs.mkdirSync(dir, '0777');
  fs.writeFileSync(dir + "/" + fileName, data);
  return util.format(paths.UPLOAD_IMAGE_ACCESS_SRC, uid, fileName);
}

function getParamIndex(paramName) {
  return paramName.split('_')[1];
}

