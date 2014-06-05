var mongoose = global.mongoose;

// define the schema for our user model
var postSchema = mongoose.Schema({
  subject: String,
  location: String,
  summary: String,
  address: String,
  phone: String,
  postImage: String,
  createdBy: String,
  createdDate: Date,
  lastModifiedDate: Date
});

var Post = mongoose.model('Post', postSchema);

// create the model for users and expose it to our app
module.exports = Post;