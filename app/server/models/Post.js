var modelHelper = require('./modelHelper');

var fields = [
  {
    name: 'subject',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'location',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'summary',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'address',
    type: {
      street: String,
      city: String,
      coordinates: {
        x: Number,
        y: Number
      }
    },
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'phone',
    type: String,
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'images',
    type: [String],
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'tags',
    type: [{
      text: String
    }],
    allowCreate: true,
    allowUpdate: true
  },
  {
    name: 'createdBy',
    type: String,
    allowCreate: true,
    allowUpdate: false
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

var Post = modelHelper.generateModel('Post', fields);

// create the model for users and expose it to our app
module.exports = Post;