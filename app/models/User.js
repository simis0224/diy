var Base = require('./Base');
var util = require('util');

const ENTITY_NAME = 'user';
const FIELDS = [
  '_id',
  'subject',
  'userName',
  'email',
  'password',
  'createdDate',
  'lastUpdatedDate'
];

module.exports = User;

function User() {
  Base.call(this);
}

util.inherits(User, Base);

User.prototype.getCollectionName = function() {
  return ENTITY_NAME;
}

User.prototype.getFields = function() {
  return FIELDS;
}


