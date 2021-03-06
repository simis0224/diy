var NodeCache = require('node-cache');
var idToUserCache = new NodeCache();
var usernameToUserCache = new NodeCache();
var _ = require('lodash');
var assert = require('assert');
var traverse = require('traverse');

var startUserCache = function() {
  var User = require('../models/User');
  User.find({}, 'username', function(err, users) {
    _.forEach(users, function(user) {
      updateUserInfoCache(user);
    })
    console.log(idToUserCache.stats.keys + ' UserInfos are loaded!');
  });
}

var updateCurrentUserInfo = function(req, user) {
  if(user && user.id && user.username) {
    updateUserInfoCache(user);
    updateUserInSession(req, user);
  } else {
    console.error('Failed to update UserInfo for user: ' + user);
  }
}

var updateUserInSession = function(req, user) {
  if (req && req.session) {
    req.session.user = {
      id: user.id,
      username: user.username
    }

    if (user.isAdmin) {
      req.session.user.isAdmin = user.isAdmin;
    }
  }
}

var deleteUserInSession = function(req) {
  delete req.session.user;
}

var getCurrentUser = function(req) {
  if(req && req.session && req.session.user) {
    return req.session.user;
  } else {
    return null;
  }
}

var getUserById = function(id) {
  if (id) {
    var user = traverse(idToUserCache.get(id)).get([id]);
    if (user) {
      return {
        id: user.id,
        username: user.username
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

var getUserByUsername = function(username) {
  if (username) {
    var user = traverse(usernameToUserCache.get(username)).get([username]);
    if (user) {
      return {
        id: user.id,
        username: user.username
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

var updateUserInfoCache = function(user) {
  var oldUser = getUserById(user.id);
  var newUser = {
    id: user.id,
    username: user.username
  };
  idToUserCache.set(newUser.id, newUser);
  if(oldUser) {
    usernameToUserCache.del(oldUser.username);
  }
  usernameToUserCache.set(newUser.username, newUser);
  assert.equal(idToUserCache.stats.keys, usernameToUserCache.stats.keys,
    'Error: idToUsercache and usernameToUsercache have different size!');
}

module.exports.startUserCache = startUserCache;
module.exports.getCurrentUser = getCurrentUser;
module.exports.updateCurrentUserInfo = updateCurrentUserInfo;
module.exports.updateUserInSession = updateUserInSession;
module.exports.deleteUserInSession = deleteUserInSession;
module.exports.getUserById = getUserById;
module.exports.getUserByUsername = getUserByUsername;