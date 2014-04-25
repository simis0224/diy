var UserController = require('../controllers/UserController');
var PostController = require('../controllers/PostController');
var HomeController = require('../controllers/HomeController');

module.exports = function(app, passport) {

  app.get('/', function(req, res, next) {
    HomeController.renderHomePage(req, res, next);
  });

  app.get('/login', function(req, res, next) {
    UserController.renderLoginPage(req, res, next);
  });



  app.get('/editUser/:username', function(req, res, next) {
    UserController.viewUser(req, res, false, next);
  });
  app.post('/editUser/:username', function(req, res, next) {
    UserController.updateUser(req, res, next);
  });

  app.get('/viewUser/:username', function(req, res, next) {
    UserController.viewUser(req, res, true, next);
  });
  app.get('/listUsers', function(req, res, next) {
    UserController.listUsers(req, res, next);
  });

  app.get('/createPost', isLoggedIn, function(req, res, next) {
    PostController.renderNewPostPage(req, res, next);
  });
  app.post('/createPost', isLoggedIn, function(req, res, next) {
    PostController.createPost(req, res, next);
  });

  app.get('/viewPost/:id', function(req, res, next) {
    PostController.viewPost(req, res, next);
  });

  app.get('/listPosts/:username', function(req, res, next) {
    PostController.listPosts(req, res, next);
  });

  app.get('/listPosts', function(req, res, next) {
    PostController.listPosts(req, res, next);
  });

  app.get('/signup', function(req, res, next) {
    UserController.renderSignupPage(req, res, next);
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
    req.logout();
    res.redirect('/');
  });
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}