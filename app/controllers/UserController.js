var traverse = require('traverse');
var BaseController = require('./BaseController');
var User = require('../models/User');
var bcrypt = require('bcrypt');
var validator = require("validator");
var _ = require("lodash");
var mongo = require('mongodb');
var BSON = mongo.BSONPure;

var model = new User();

module.exports = BaseController.extend({});

function createUser(req, res, next) {
  var userData = {
    email: traverse(req).get(['body','email']),
    userName: traverse(req).get(['body','userName']),
    password: generateEncryptedPassword(traverse(req).get(['body','password']))
  };

  model.setDB(traverse(req).get(['db']));
  model.setData(userData, true);

  if(!validator.isEmail(userData.email)) {
    res.render('createUser', {
      message: '错误电子邮件格式'
    })
    return;
  }

  doesUserExist(userData, function(err, items) {
    if(err) {
      console.log(err);
    }
    var message;
    if(items.length > 0) {
      res.render('createUser', {
        user: userData,
        message: '该用户名或邮件已存在'
      });
    } else {
      model.insert(function() {
        res.render('createUser', {
          user: userData,
          message: '用户注册成功'
        })
      });
    }
  });
}

function viewUser(req, res, isView, next) {
  model.setDB(traverse(req).get(['db']));
  var userName = traverse(req).get(['params','userName']);
  var view = isView ? 'viewUser' : 'editUser';
  if(!userName) {
    res.render(view, {
      message: '无效用户名'
    })
  }

  getUserByUserName(userName, function(err, items) {
    if(err) {
      console.log(err);
    }
    var message;
    var user;
    if(items.length === 0) {
      message = '用户' + userName + '不存在';
    } else {
      user = items[0];
    }
    res.render(view, {
      message: message,
      user: user
    })
  })
}

function updateUser(req, res, next) {
  var userData = {
    _id: traverse(req).get(['body','id']),
    email: traverse(req).get(['body','email']),
    userName: traverse(req).get(['body','userName']),
  };

  var password = generateEncryptedPassword(traverse(req).get(['body','password']));
  if(password) {
    userData.password = password;
  }

  model.setDB(traverse(req).get(['db']))
  model.setData(userData, false);

  if(!validator.isEmail(userData.email)) {
    res.render('editUser', {
      user: data,
      message: '错误电子邮件格式'
    })
    return;
  }

  doesUserExist(userData, function(err, items) {
    if(err) {
      console.log(err);
    }
    var message;
    if(items.length > 0 &&
      _.some(items, function(item) {
        return item._id != userData._id
    })) {
      res.render('editUser', {
        user: userData,
        message: '该用户名或邮件已存在'
      });
    } else {
      updateUserById(userData._id, function() {
        res.render('editUser', {
          user: userData,
          message: '更新用户资料成功'
        })
      });
    }
  });
}

function renderRegisterPage(req, res, next) {
  res.render('createUser', {});
}

function listUsers(req, res, next) {
  model.setDB(traverse(req).get(['db']));

  getAllUsers(function(err, items) {
    if(err) {
      console.log(err);
    }
    res.render('listUsers', {
      users: items
    })
  })
}

function doesUserExist(data, callback) {
  model.get({ $or: [ { userName: data.userName}, { email: data.email } ] }, callback);
}

function getUserByUserName(userName, callback) {
  model.get({ userName: userName }, callback);
}

function getAllUsers(callback) {
  model.get({}, callback);
}

function updateUserById(userId, callback) {
  model.update( { _id: new BSON.ObjectID(userId) }, callback);
}

function generateEncryptedPassword(password) {
  if(!password) {
    return password;
  }

  var salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.viewUser = viewUser;
module.exports.renderRegisterPage = renderRegisterPage;
module.exports.listUsers = listUsers;

