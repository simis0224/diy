
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'), 
	path = require('path'),
	config = require('./config')(),
	app = express(),
	MongoClient = require('mongodb').MongoClient,

  UserController = require('./controllers/UserController'),
  PostController = require('./controllers/PostController'),
  HomeController = require('./controllers/HomeController');

// all environments
app.set('views', __dirname + '/views');
console.log(__dirname);
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('diy-site'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  	app.use(express.errorHandler());
}

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/diy', function(err, db) {
	if(err) {
		console.log('Sorry, there is no mongo db server running.');
	} else {
		var attachDB = function(req, res, next) {
			req.db = db;
			next();
		};

    app.get('/', attachDB, function(req, res, next) {
      HomeController.renderRegisterPage(req, res, next);
    });
    app.get('/register', attachDB, function(req, res, next) {
      UserController.renderRegisterPage(req, res, next);
    });
    app.post('/register', attachDB, function(req, res, next) {
      UserController.createUser(req, res, next);
    });

    app.get('/editUser/:userName', attachDB, function(req, res, next) {
      UserController.viewUser(req, res, false, next);
    });
    app.post('/editUser/:userName', attachDB, function(req, res, next) {
      UserController.updateUser(req, res, next);
    });

    app.get('/viewUser/:userName', attachDB, function(req, res, next) {
      UserController.viewUser(req, res, true, next);
    });
    app.get('/listUsers', attachDB, function(req, res, next) {
      UserController.listUsers(req, res, next);
    });

		app.get('/createPost', attachDB, function(req, res, next) {
			PostController.renderNewPostPage(req, res, next);
		});
    app.post('/createPost', attachDB, function(req, res, next) {
      PostController.createPost(req, res, next);
    });

		http.createServer(app).listen(config.port, function() {
		  	console.log(
		  		'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
		  		'\nExpress server listening on port ' + config.port
		  	);
		});
	}
});