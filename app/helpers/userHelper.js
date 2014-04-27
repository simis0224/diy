var cache = require('memory-cache');
var _ = require('lodash');

var startUserCache = function() {
  var User = require('../models/User');
  User.find({}, 'username', function(err, users) {
    _.forEach(users, function(user) {
      cache.put(user.id, user);
    })
    global.userInfo = cache;
    console.log(cache.size() + ' UserInfos are loaded!');
  });
}

var updateCurrentUserInfo = function(req, user) {
  if(global.userInfo && user && user.id && user.username) {
    global.userInfo.put(user.id, user);
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
  }
}

var getCurrentUser = function(req) {
  if(req && req.session) {
    return req.session.user;
  } else {
    return null;
  }
}

module.exports.startUserCache = startUserCache;
module.exports.getCurrentUser = getCurrentUser;
module.exports.updateCurrentUserInfo = updateCurrentUserInfo;
module.exports.updateUserInSession = updateUserInSession;