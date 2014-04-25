var traverse = require('traverse');
var User = require('../models/User');

function createUser(req, res, next) {
  var userData = {
    email: traverse(req).get(['body','email']),
    username: traverse(req).get(['body','username']),
    password: User.generateHash(traverse(req).get(['body','password'])),
    createdDate: new Date(),
    lastModifedDate: new Date()
  }

  User
    .findOne( { $or: [ { username: userData.username}, { email: userData.email } ] })
    .exec(function(err, user) {
      // if there are any errors, return the error
      if (err) {
        console.error(err);
        res.render('createUser', {
          user: userData,
          message: '内部错误'
        });
      }

      // check to see if theres already a user with that email
      if (user) {
        res.render('createUser', {
          user: userData,
          message: '该用户名或邮件已存在'
        });
      } else {

        // if there is no user with that email
        // create the user
        var newUser = new User(userData);

        // save the user
        newUser.save(function(err) {
          if (err) {
            console.error(err);
            var message = "";
            // TODO fix validation
            if (err.name === 'ValidationError') {
              message = err.errors[Object.keys(err.errors)[0]].message;
            } else {
              message = '内部错误';
            }
            res.render('createUser', {
              user: userData,
              message: message
            });
            return;
          }
          res.render('createUser', {
            user: userData,
            message: '用户注册成功'
          });
        });
      }
    });
}

function viewUser(req, res, isView, next) {
  var username = traverse(req).get(['params','username']);
  if(!username) {
    res.render('viewUser', {
      message: '无效用户名'
    })
  }

  User
    .findOne( { username: username })
    .exec(function(err, user) {
      // if there are any errors, return the error
      if (err) {
        console.error(err);
        res.render('viewUser', {
          message: '内部错误'
        });
      }

      // check to see if theres already a user with that email
      var message;
      if(!user) {
        message = '用户' + username + '不存在';
      }
      res.render('viewUser', {
        message: message,
        user: user
      });
    });
}

function updateUser(req, res, next) {
  var userData = {
    _id: traverse(req).get(['body','id']),
    email: traverse(req).get(['body','email']),
    username: traverse(req).get(['body','username'])
  };

  var password = traverse(req).get(['body','password']);
  if(password) {
    userData.password = User.generateHash(password);
  }

  User
    .findOne( { _id: userData._id })
    .exec(function (err, user) {
      // if there are any errors, return the error
      if (err) {
        console.error(err);
        res.render('editUser', {
          user: userData,
          message: '内部错误'
        });
      }

      // check to see if theres already a user with that email
      if (!user) {
        message = '用户不存在';
      } else {

        user.set(userData);
        // if there is no user with that email
        // create the user
        // save the user
        user.save(function (err) {
          if (err) {
            console.error(err);
            var message = "";
            // TODO fix validation
            if (err.name === 'ValidationError') {
              message = err.errors[Object.keys(err.errors)[0]].message;
            } else {
              message = '内部错误';
            }
            res.render('editUser', {
              user: userData,
              message: message
            });
            return;
          }
          res.render('editUser', {
            user: userData,
            message: '用户资料修改成功'
          });
        });
      }
    }
  );
}

function renderRegisterPage(req, res, next) {
  res.render('createUser', {});
}

function renderLoginPage(req, res, next) {
  res.render('login', {});
}

function listUsers(req, res, next) {
  User
    .find()
    .exec(function(err, items) {
      if(err) {
        console.log(err);
      }
      res.render('listUsers', {
        users: items
      })
    })
}

module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.viewUser = viewUser;
module.exports.renderRegisterPage = renderRegisterPage;
module.exports.listUsers = listUsers;
module.exports.renderLoginPage = renderLoginPage;


