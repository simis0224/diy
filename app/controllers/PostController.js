var traverse = require('traverse');
var Post = require('../models/Post');
var fs = require('fs');
var crypto = require('crypto');
var util = require('util');
var paths = require('../constants/paths');
var userHelper = require('../helpers/userHelper');
var labels = require('../labels/labels');

function renderNewPostPage(req, res, next) {
  res.render('createPost', {
    currentUser: userHelper.getCurrentUser(req)
  });
}

function createPost(req, res, next) {
  var postData = {
    subject: traverse(req).get(['body','subject']),
    description: traverse(req).get(['body','description']),
    pic: handleFileUpload(req),
    createdBy: userHelper.getCurrentUser(req).id,
    createdDate: new Date(),
    lastModifedDate: new Date()
  };

  var newPost = new Post(postData);
  newPost.save(function(err, post) {
    if (err) {
      console.error(err);
      req.flash('message', labels.error.internalError);
      // TODO pass postData
      return;
    }
    res.redirect('/viewPost/' + post._id);
  });
}

function renderViewPostPage(req, res, isView, next) {
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
        post: post,
        currentUser: userHelper.getCurrentUser(req)
      });
    });
}

function renderPostListPage(req, res, next) {
  var username = traverse(req).get(['params','username']);
  var userId = traverse(userHelper.getUserByUsername(username)).get(['id']);
  var query = {};
  if(userId) {
    query = {
      createdBy: userId
    }
  }

  Post
    .find(query)
    .exec(function(err, items) {
      if(err) {
        console.log(err);
      }
      res.render('listPosts', {
        posts: items,
        currentUser: userHelper.getCurrentUser(req)
      })
    })
}

function handleFileUpload(req) {
  if(!req.files || !req.files.pic || !req.files.pic.name) {
    return req.body.currentPicture || '';
  }
  var data = fs.readFileSync(req.files.pic.path);
  var fileName = req.files.pic.name;
  var uid = crypto.randomBytes(10).toString('hex');
  var dir = paths.UPLOAD_IMAGE_DIR + uid;
  fs.mkdirSync(dir, '0777');
  fs.writeFileSync(dir + "/" + fileName, data);
  return util.format(paths.UPLOAD_IMAGE_ACCESS_SRC, uid, fileName);
}


module.exports.createPost = createPost;

module.exports.renderNewPostPage = renderNewPostPage;
module.exports.renderViewPostPage = renderViewPostPage;
module.exports.renderPostListPage = renderPostListPage;


