const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    companyname: { type: String, required: true },
    companyscale: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Products: [{ type: String}],
    firstname: { type: String },
    lastname: { type: String },
    description: { type: String },
    avatar: { type: String },
    coverPhoto: { type: String },
    aboutus: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    Page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    profileType: { 
      type: String, 
      enum: ['user', 'company'], 
      default: 'user',
      required: true 
    }
  },
  {
    timestamps: true,
    collection: 'Users',
  }
);

const User = mongoose.model('User', userSchema);


module.exports = User;
