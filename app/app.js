
/**
 * Module dependencies.
 */
const MONGODB_NAME = 'diy';

var mongoose = require('mongoose');
var express = require('express');
var	http = require('http');
var	path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var	config = require('./config/config.js')();


var app = express();

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
  console.log('MongoDB is connected!');
});
global.mongoose = (global.mongoose ? global.mongoose : mongoose.connect(config.mongodb.host + ':' + config.mongodb.port + '/' + MONGODB_NAME));

app.configure(function() {

  // all environments
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('diy-site'));
  app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistent login sessions
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(flash());

// development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
});

require('./app/passport')(passport);
require('./app/routes.js')(app, passport);

http.createServer(app).listen(config.port, function() {
    console.log('Express server listening on port ' + config.mongodb.port);
});