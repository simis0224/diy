var traverse = require('traverse');
var Post = require("../models/Post");
var model = new Post();


function renderNewPostPage(req, res, next) {
  res.render('createPost', {});
}

function createPost(req, res, next) {
  var postData = {
    subject: traverse(req).get(['body','subject']),
    description: traverse(req).get(['body','description']),
    pic: traverse(req).get(['body','pic']),
    createdBy: 'simis0224',
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
      user: postData,
      message: '作品发布成功'
    });
  });
}

function updatePost(req, res, next) {

}

module.exports.renderNewPostPage = renderNewPostPage;
module.exports.createPost = createPost;

