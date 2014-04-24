var traverse = require('traverse');
var BaseController = require("./BaseController");
var Post = require("../models/Post");
var model = new Post();

module.exports = BaseController.extend({});

function renderNewPostPage(req, res, next) {
  res.render('createPost', {});
}

function createPost(req, res, next) {
  var postData = {
    subject: 'subject',
    body: 'body',
    pic: 'pic',
    createdBy: 'createdBy'
  };

  model.setDB(traverse(req).get(['db']));
  model.setData(postData, true);

  model.insert(function() {
    res.render('createPost', {
      user: postData
    })
  });
}

function updatePost(req, res, next) {
  var postData = {
  };

  model.setDB(traverse(req).get(['db']))
  model.setData(postData, false);

  model.insert(function() {
    res.render('createPost', {
      user: postData
    })
  });
}

module.exports.renderNewPostPage = renderNewPostPage;
module.exports.createPost = createPost;

