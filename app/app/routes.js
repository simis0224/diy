var HomeController = require('../controllers/HomeController');
var UserController = require('../controllers/userController');
var userController = new UserController();
var PostController = require('../controllers/postController');
var postController = new PostController();
var userHelper = require('../helpers/userHelper.js');

module.exports = function(app, passport) {

  app.get('/api/loggedInUser', function(req, res) {
    res.send(req.isAuthenticated() ? userHelper.getCurrentUser(req) : '0');
  });

  app.get('/login', function(req, res, next) {
    userController.renderLoginPage(req, res, next);
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/logout', function(req, res) {
    userController.logout(req, res);
  });

  app.get('/api/post/:id', function(req, res) {
    postController.findOne(req, res);
  });

  app.get('/api/posts', function(req, res) {
    postController.find(req, res);
  });

  app.post('/api/post', isLoggedIn, function(req, res, next) {
    postController.apiCreate(req, res, next);
  });

  app.delete('/api/post/:id', isLoggedIn, function(req, res, next) {
    postController.apiDelete(req, res, next);
  });

  app.get('*', function(req, res) {
    res.sendfile('./public/components/viewPost.html');
  });

  app.get('/', function(req, res, next) {
    HomeController.renderHomePage(req, res, next);
  });

  app.get('/editUser/:username', isLoggedIn, function(req, res, next) {
    userController.renderEditPage(req, res, next);
  });
  app.post('/editUser/:username', isLoggedIn, function(req, res, next) {
    userController.update(req, res, next);
  });

  app.get('/viewUser/:username', function(req, res, next) {
    userController.renderViewPage(req, res, next);
  });
  app.get('/listUser', function(req, res, next) {
    userController.renderListPage(req, res, next);
  });

  app.get('/createPost', isLoggedIn, function(req, res, next) {
    postController.renderCreatePage(req, res, next);
  });
  app.post('/createPost', isLoggedIn, function(req, res, next) {
    postController.create(req, res, next);
  });

//  app.get('/viewPost/:id', function(req, res, next) {
//    postController.renderViewPage(req, res, next);
//  });

  app.get('/editPost/:id', isLoggedIn, function(req, res, next) {
    postController.renderEditPage(req, res, next);
  });
  app.post('/editPost/:id', isLoggedIn, function(req, res, next) {
    postController.update(req, res, next);
  });

  app.get('/listPost/:username', function(req, res, next) {
    postController.renderListPage(req, res, next);
  });

  app.get('/listPost', function(req, res, next) {
    postController.renderListPage(req, res, next);
  });

  app.post('/deletePost/:id', isLoggedIn, function(req, res, next) {
    postController.delete(req, res, next);
  });

  app.get('/signup', function(req, res, next) {
    userController.renderCreatePage(req, res, next);
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
  }));
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}