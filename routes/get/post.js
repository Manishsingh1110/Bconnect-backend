const express = require('express');
const router = express.Router();
const Post = require('../../models/post');
const fetchuser = require('../../middleware/fetchuser');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
// Create a route to get a random selection of up to 40 posts
router.get('/', async (req, res) => {
  try {
    const randomPosts = await Post.aggregate([
      { $sample: { size: 40 } },
      {
        $lookup: {
          from: 'Users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
        },
      },
      {
        $project: {
          'author.password': 0, // Exclude the password field from author
        },
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] } // Replace 'author' with the first (and only) element of the 'author' array
        }
      }
    ]);
    res.status(200).json(randomPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/userpost', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new ObjectId(userId);
    // Use the find method to retrieve all posts with the specified author ID
    const userPosts = await Post.aggregate([
      {
        $lookup: {
          from: 'Users',
          let: { authorId: '$author' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', '$$authorId'] },
              },
            },
            {
              $project: {
                password: 0, // Exclude the password field from author
              },
            },
          ],
          as: 'author',
        },
      },
      {
        $addFields: {
          author: { $arrayElemAt: ['$author', 0] },
        },
      },
      {
        $match: { 'author._id': userObjectId }, // Filter by the specified userId
      },
    ]);
    
    res.status(200).json(userPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
