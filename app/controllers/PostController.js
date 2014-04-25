var traverse = require('traverse');
var Post = require("../models/Post");

function renderNewPostPage(req, res, next) {
  res.render('createPost', {});
}

function createPost(req, res, next) {
  var postData = {
    subject: traverse(req).get(['body','subject']),
    description: traverse(req).get(['body','description']),
    pic: traverse(req).get(['body','pic']),
    createdBy: req.session.username,
    createdDate: new Date(),
    lastModifedDate: new Date()
  };

  var newPost = new Post(postData);

  newPost.save(function(err) {
    if (err) {
      console.error(err);
      res.render('createPost', {
        user: postData,
        message: '内部错误'
      });
      return;
    }
    res.render('createPost', {
      post: postData,
      message: '作品发布成功'
    });
  });
}

function viewPost(req, res, isView, next) {
  var id = traverse(req).get(['params','id']);
  if(!id) {
    res.render('viewPost', {
      message: '该作品不存在'
    })
  }

  Post
    .findOne( { _id: id })
    .exec(function(err, post) {
      // if there are any errors, return the error
      if (err) {
        console.error(err);
        res.render('viewPost', {
          message: '内部错误'
        });
      }

      // check to see if theres already a user with that email
      var message;
      if(!post) {
        message = '作品不存在';
      }
      res.render('viewPost', {
        message: message,
        post: post
      });
    });
}

function listPosts(req, res, next) {
  var username = traverse(req).get(['params','username']);

  var query = {};
  if(username) {
    query = {
      createdBy: username
    }
  }

  Post
    .find(query)
    .exec(function(err, items) {
      if(err) {
        console.log(err);
      }
      res.render('listPosts', {
        posts: items
      })
    })
}

module.exports.renderNewPostPage = renderNewPostPage;
module.exports.createPost = createPost;
module.exports.viewPost = viewPost;
module.exports.listPosts = listPosts;


