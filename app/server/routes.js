var UserController = require('./controllers/userController');
var userController = new UserController();
var PostController = require('./controllers/postController');
var postController = new PostController();

var AuthController = require('./controllers/authController');
var authController = new AuthController();

var uploadController = require('./controllers/uploadController');

var errors = require('./constants/errors');

var userHelper = require('./helpers/userHelper');

module.exports = function(app, passport) {

  /**
   * User related api
   */
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

  app.get('/api/user/list', isLoggedIn, function(req, res) {
    userController.apiList(req, res);
  });

  app.get('/api/user/:id', function(req, res) {
    userController.apiGetOne(req, res);
  });

  app.post('/api/user/update/:id', isLoggedIn, function(req, res, next) {
    userController.apiUpdate(req, res, next);
  });

  app.get('/weibo/login', function(req, res) {
      var user = req.session.user;
      res.writeHeader(200, { 'Content-type': 'text/html' });
      if (!user) {
        res.end("Login with <a href='/login?type=weibo'>Weibo</a>");
      } else {
        res.end("Hello " + user.username);
      }
  });

  /**
   * Upload api
   */
  app.post('/api/upload/image', isLoggedIn, isAdmin, function(req, res, next) {
    uploadController.apiUploadImage(req, res, next);
  });

  /**
   * Post related api
   */
  app.get('/api/post/list', function(req, res) {
    postController.apiList(req, res);
  });

  app.get('/api/post/:id', function(req, res) {
    postController.apiGetOne(req, res);
  });

  app.post('/api/post/create', isLoggedIn, isAdmin, function(req, res, next) {
    postController.apiCreate(req, res, next);
  });

  app.post('/api/post/update/:id', isLoggedIn, isAdmin, function(req, res, next) {
    postController.apiUpdate(req, res, next);
  });

  app.post('/api/post/delete/:id', isLoggedIn, isAdmin, function(req, res, next) {
    postController.apiDelete(req, res, next);
  });

  app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res
    .status(401)
    .send(errors.USER_NOT_LOGGED_IN_ERROR);
}

function isAdmin(req, res, next) {
  if (userHelper.getCurrentUser(req).isAdmin) {
    return next();
  }

  res
    .status(401)
    .send(errors.NO_PRIVILEGE_ERROR);
}