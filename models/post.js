const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  postText: { type: String, required: true },
  postImages: [String],
  likeCount: { type: Number,default:0},
  comment: [{ type: String}],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true, // To automatically add createdAt and updatedAt fields
  collection: 'Posts',
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

    