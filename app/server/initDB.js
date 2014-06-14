var	config = require('./config/config')();
var mongoose = require('mongoose');

const MONGODB_NAME = 'diy';

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
  console.log('MongoDB is connected!');
});
global.mongoose = (global.mongoose ? global.mongoose : mongoose.connect(config.mongodb.host + ':' + config.mongodb.port + '/' + MONGODB_NAME));

var User = require('./models/User');
var userData = {
  email: "admin@gmail.com",
  username: "admin",
  password: User.generateHash("password"),
  createdDate: new Date(),
  lastModifiedDate: new Date(),
  isAdmin: true
}

var newUser = new User(userData);
newUser.save(function(err, user) {
  if (err) {
    console.log("Admin user creation error: " + err);
  } else {
    console.log("Admin user is successfully created!");
  }
});
