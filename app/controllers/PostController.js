var traverse = require('traverse');
var Post = require('../models/Post');
var fs = require('fs');
var crypto = require('crypto');
var util = require('util');
var paths = require('../constants/paths');
var userHelper = require('../helpers/userHelper');
var labels = require('../labels/labels');
var categoryEnum = require('../models/CategoryEnum');

function updatePost(req, res, next) {
  var postData = {
    _id: traverse(req).get(['body','id']),
    subject: traverse(req).get(['body','subject']),
    category: traverse(req).get(['body', 'category']),
    description: traverse(req).get(['body','description']),
    lastModifedDate: new Date()
  };

  var password = traverse(req).get(['body','password']);
  if(password) {
    userData.password = User.generateHash(password);
  }

  if(req.files && req.files.pic && req.files.pic.name) {
    postData.pic = handleFileUpload(req);
  }

  Post
    .findOne( { _id: postData._id })
    .exec(function (err, post) {
      if (err) {
        console.error(err);
        req.flash('message', labels.error.internalError);
        res.redirect('/editPost/' + postData._id);
      }

      if (!post) {
        req.flash('message', labels.post.postNotFound);
        res.redirect('/listPosts/' + userhelper.getCurrentUser(req).username);
      } else {
        post.set(postData);
        post.save(function (err, post) {
          if (err) {
            console.error(err);
            // TODO fix validation
            if (err.name === 'ValidationError') {
              req.flash('message', err.errors[Object.keys(err.errors)[0]].message);
            } else {
              req.flash('message', labels.error.internalError);
            }
            res.redirect('/editPost/' + postData._id);
            return;
          }
          req.flash('message', labels.post.updateSuccessful);
          res.redirect('/viewPost/' + postData._id);
        });
      }
    }
  );
}

function createPost(req, res, next) {
  var postData = {
    subject: traverse(req).get(['body','subject']),
    category: traverse(req).get(['body', 'category']),
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

function deletePost(req, res, next) {
  var postId = traverse(req).get(['params','id']);

  if(!postId) {
    req.flash('message', labels.error.internalError);
    res.redirect('/listPosts');
    return;
  }

  Post
    .findOne( { _id: postId })
    .exec(function(err, post) {
      if(err) {
        console.error(err);
        req.flash('message', labels.error.internalError);
        res.redirect('/viewPost/' + postId)
        return;
      }

      if(!post) {
        req.flash('message', labels.post.postNotFound);
        res.redirect('/viewPost/' + postId);
      } else {
        post.remove(function(err, post) {
          if(err) {
            req.flash('message', labels.error.internalError);
            res.redirect('/viewPost/' + postId)
          }
          req.flash('message', labels.post.deleteSuccessful);
          res.redirect('/listPosts/' + userHelper.getCurrentUser(req).username);
        });
      }
    });
}

function renderNewPostPage(req, res, next) {
  res.render('createPost', {
    categories: categoryEnum.enums,
    currentUser: userHelper.getCurrentUser(req),
    message: req.flash('message')
  });
}

function renderViewPostPage(req, res, isView, next) {
  var id = traverse(req).get(['params','id']);
  if(!id) {
    req.flash('message', labels.post.postNotFound);
    res.redirect('/viewPost');
  }

  Post
    .findOne( { _id: id })
    .exec(function(err, post) {
      if (err) {
        console.error(err);
        req.flash('message', labels.error.internalError);
        res.redirect('/viewPost');
      }

      var message = req.flash('message');
      if(!post) {
        message = labels.post.postNotFound;
      }

      if(post && post.category) {
        post.categoryInLabel = traverse(categoryEnum.getEnumByDbValue(post.category)).get(['value', 'label']);
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
        req.flash('message', labels.error.internalError);
        console.log(err);
      }
      res.render('listPosts', {
        posts: items,
        currentUser: userHelper.getCurrentUser(req),
        message: req.flash("message")
      })
    })
}

function renderEditPostPage(req, res, next) {
  var postId = traverse(req).get(['params','id']);
  if(!postId) {
    req.flash('message', labels.error.pageNotFound);
    res.render('editPost', {
      message: req.flash('message'),
      currentUser: userHelper.getCurrentUser(req)
    })
  }

  Post
    .findOne( { _id: postId })
    .exec(function(err, post) {
      var message = req.flash('message');
      if (err) {
        console.error(err);
        message = labels.error.internalError;
      }

      if(!post) {
        message = labels.post.postNotFound;
      }

      res.render('editPost', {
        message: message,
        post: post,
        currentUser: userHelper.getCurrentUser(req),
        categories: categoryEnum.enums
      });
    });
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
module.exports.deletePost = deletePost;
module.exports.updatePost = updatePost;

module.exports.renderNewPostPage = renderNewPostPage;
module.exports.renderEditPostPage = renderEditPostPage;
module.exports.renderViewPostPage = renderViewPostPage;
module.exports.renderPostListPage = renderPostListPage;


