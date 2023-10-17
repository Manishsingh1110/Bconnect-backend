const express = require('express');
const router = express.Router();
const Post = require('../../models/post');
const User = require('../../models/user'); // Import your User model
const Group = require('../../models/group'); // Import your Group model
const fetchuser = require('../../middleware/fetchuser');
const multer = require('multer'); // Import multer for file uploads
const path = require('path');

// Set up multer to store uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Create an 'uploads' directory in your project
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Create a route to add a new post
router.post('/user', fetchuser, upload.array('postImages'), async (req, res) => {
  try {
    const { postText } = req.body;
    const postImages = req.files.map((file) => file.path); // Get paths of uploaded images
    var author = req.user.id;
    
    const newPost = new Post({
      postText,
      postImages,
      author,
    });
    const savedPost = await newPost.save();

    try {
      const userUpdate = await User.updateOne(
        { _id: author },
        { $push: { posts: savedPost._id } }
      );
      if (userUpdate.nModified === 0) {
        await Post.deleteOne({ _id: savedPost._id });
        return res.status(500).json({ message: 'Failed to update user posts' });
      }
      res.status(201).json(savedPost);
    } catch (updateError) {
      console.error(updateError);
      await Post.deleteOne({ _id: savedPost._id });
      res.status(500).json({ message: 'Failed to update user posts' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a route to add a new post to a group
router.post('/group', fetchuser, upload.array('postImages'), async (req, res) => {
  try {
    var author = req.user.id;
    const { postText, likeCount, comment, groupId } = req.body;
    const postImages = req.files.map((file) => file.path); // Get paths of uploaded images

    const newPost = new Post({
      postText,
      postImages,
      likeCount,
      comment,
      author,
    });
    const savedPost = await newPost.save();

    try {
      const groupUpdate = await Group.updateOne(
        { _id: groupId },
        { $push: { posts: savedPost._id } }
      );
      if (groupUpdate.nModified === 0) {
        await Post.deleteOne({ _id: savedPost._id });
        return res.status(500).json({ message: 'Failed to update group posts' });
      }
      res.status(201).json(savedPost);
    } catch (updateError) {
      console.error(updateError);
      await Post.deleteOne({ _id: savedPost._id });
      res.status(500).json({ message: 'Failed to update group posts' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
