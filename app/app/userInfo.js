var cache = require('memory-cache');
var _ = require('lodash');

module.exports = function() {
  var User = require('../models/User');
  User.find({}, 'username', function(err, users) {
    _.forEach(users, function(user) {
      cache.put(user.id, user);
    })
    global.userInfo = cache;
    console.log('UserInfo is loaded!');
  });
}