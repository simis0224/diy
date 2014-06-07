var bcrypt   = require('bcrypt-nodejs');
var mongoose = global.mongoose;
var validator = require("validator");
var modelHelper = require('./modelHelper');

var fields = [
  {
    name: 'email',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'username',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'password',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'status',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'isAdmin',
    type: Boolean,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'profileImage',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'createdDate',
    type: Date,
    allowCreate: true,
    allowUpdate: false,
    isSystemGenerated: true
  },
  {
    name: 'lastModifiedDate',
    type: Date,
    allowCreate: true,
    allowUpdate: true,
    isSystemGenerated: true
  }
]

var User = modelHelper.generateModel('User', fields);

User.schema.path('email').validate(function (value) {
  return validator.isEmail(value);
}, '错误邮件格式');

User.schema.path('username').validate(function (value) {
  return value && value.trim().length >= 4;
}, '用户名长度大于等于4');

User.schema.path('password').validate(function (value) {
  return value && value.trim().length >= 8;
}, '密码长度大于等于8');

// methods ======================
// generating a hash
function generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
function validatePassword(password1, password2) {
  return bcrypt.compareSync(password1, password2);
};

// create the model for users and expose it to our app
module.exports = User;
module.exports.generateHash = generateHash;
module.exports.validatePassword = validatePassword;


