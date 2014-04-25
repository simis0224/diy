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

  app.get('/register', function(req, res, next) {
    UserController.renderRegisterPage(req, res, next);
  });
  app.post('/register', function(req, res, next) {
    UserController.createUser(req, res, next);
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

  app.get('/createPost', function(req, res, next) {
    PostController.renderNewPostPage(req, res, next);
  });
  app.post('/createPost', function(req, res, next) {
    PostController.createPost(req, res, next);
  });

  app.get('/viewPost/:id', function(req, res, next) {
    PostController.viewPost(req, res, next);
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
}

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}