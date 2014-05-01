var UserController2 = require('../controllers/UserController2');
var HomeController = require('../controllers/HomeController');
var UserController = require('../controllers/userController');
var userController = new UserController();
var PostController = require('../controllers/postController');
var postController = new PostController();

module.exports = function(app, passport) {

  app.get('/', function(req, res, next) {
    HomeController.renderHomePage(req, res, next);
  });

  app.get('/login', function(req, res, next) {
    UserController2.renderLoginPage(req, res, next);
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

  app.get('/viewPost/:id', function(req, res, next) {
    postController.renderViewPage(req, res, next);
  });

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

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  }));

  app.get('/logout', function(req, res) {
    UserController2.logout(req, res);
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}