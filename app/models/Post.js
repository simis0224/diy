var Base = require('./Base');
var util = require('util');

const ENTITY_NAME = 'post';
const FIELDS = [
  '_id',
  'body',
  'pic',
  'createdBy',
  'createdDate',
  'lastUpdatedDate'
];

module.exports = Post;

function Post() {
  Base.call(this);
}

util.inherits(Post, Base);

Post.prototype.getCollectionName = function() {
  return ENTITY_NAME;
}

Post.prototype.getFields = function() {
  return FIELDS;
}
