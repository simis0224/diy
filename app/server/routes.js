var HomeController = require('./controllers/HomeController');
var UserController = require('./controllers/userController');
var userController = new UserController();
var PostController = require('./controllers/postController');
var postController = new PostController();

var AuthController = require('./controllers/authController');
var authController = new AuthController();

var uploadController = require('./controllers/uploadController');

var errors = require('./constants/errors');

module.exports = function(app, passport) {

  app.get('/api/user/me', function(req, res) {
    authController.apiGetLoggedInUser(req, res)
  });

  app.post('/api/login', function(req, res, next) {
    authController.apiLogin(passport, req, res, next);
  });

  app.post('/api/signup', function(req, res, next) {
    authController.apiSignup(passport, req, res, next);
  });

  app.post('/api/logout', function(req, res, next) {
    authController.apiLogout(req, res, next);
  });

  app.get('/api/user/:id', function(req, res) {
    userController.apiGetOne(req, res);
  });

  app.post('/api/upload/image', function(req, res, next) {
    uploadController.apiUploadImage(req, res, next);
  });

  /**
   * Post related api
   */
  app.get('/api/post/:id', function(req, res) {
    postController.apiGetOne(req, res);
  });

  app.get('/api/posts', function(req, res) {
    postController.apiGet(req, res);
  });

  app.post('/api/post/create', isLoggedIn, function(req, res, next) {
    postController.apiCreate(req, res, next);
  });

  app.post('/api/post/update/:id', isLoggedIn, function(req, res, next) {
    postController.apiUpdate(req, res, next);
  });

  app.post('/api/post/delete/:id', isLoggedIn, function(req, res, next) {
    postController.apiDelete(req, res, next);
  });

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  //TODO should return 404
  res.json({
    success: 0,
    error: errors.USER_NOT_LOGGED_IN_ERROR
  });
}