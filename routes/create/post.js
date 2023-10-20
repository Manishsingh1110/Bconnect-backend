const express = require('express');
const router = express.Router();
const Post = require('../../models/post');
const User = require('../../models/user'); // Import your User model
const Group = require('../../models/group'); // Import your Group model
const fetchuser = require('../../middleware/fetchuser');
const multer = require('multer');
const bodyParser = require('body-parser');
const firebaseApp = require('firebase/app');
const firebaseStorage = require('firebase/storage');
const config = require('../../config');

firebaseApp.initializeApp(config.firebaseConfig);

// Set up multer to store uploaded images
const storage = firebaseStorage.getStorage();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware for parsing JSON and URL-encoded data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Create a route to add a new post with an array of images
router.post('/user', fetchuser, upload.array('postImages', 5), async (req, res) => {
  
  try {
    
  const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const dateTime = date + ' ' + time;
    return dateTime;
  };
    const { postText } = req.body;
    const author = req.user.id;
    const postImages = [];

    const dateTime = giveCurrentDateTime();

    for (const file of req.files) {
      const storageRef = firebaseStorage.ref(storage, `post/${file.originalname + ' ' + dateTime}`);
      const metadata = {
        contentType: 'image/png',
      };

      const snapshot = await firebaseStorage.uploadBytesResumable(storageRef, file.buffer, metadata);
      const imageUrl = await firebaseStorage.getDownloadURL(snapshot.ref);
      postImages.push(imageUrl);
    }

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

// Create a route to add a new post to a group with an array of images
router.post('/group', fetchuser, upload.array('postImages', 5), async (req, res) => {
  try {
    const author = req.user.id;
    const postImages = [];

    const dateTime = giveCurrentDateTime();

    for (const file of req.files) {
      const storageRef = firebaseStorage.ref(storage, `post/${file.originalname + ' ' + dateTime}`);
      const metadata = {
        contentType: 'image/png',
      };

      const snapshot = await firebaseStorage.uploadBytesResumable(storageRef, file.buffer, metadata);
      const imageUrl = await firebaseStorage.getDownloadURL(snapshot.ref);
      postImages.push(imageUrl);
    }

    const { postText, groupId } = req.body;

    const newPost = new Post({
      postText,
      postImages,
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
