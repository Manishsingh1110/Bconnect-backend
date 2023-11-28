const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    industriesproduct: [{ type: String }],
    imageUrl: { type: String },
    backgroundimageUrl: { type: String },
    location: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
    collection: 'Groups',
  }
);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group 
