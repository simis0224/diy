var mongoose = global.mongoose;

// define the schema for our user model
var postSchema = mongoose.Schema({
  subject: String,
  description: String,
  postImage: String,
  category: Number,
  materials: [{ name: String, quantity: String}],
  createdBy: String,
  createdDate: Date,
  lastModifiedDate: Date
});

var Post = mongoose.model('Post', postSchema);

// create the model for users and expose it to our app
module.exports = Post;