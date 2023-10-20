const express = require('express');
const router = express.Router();
const Post = require('../../models/post');

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

module.exports = router;
