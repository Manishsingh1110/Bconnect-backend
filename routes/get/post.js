const express = require('express');
const router = express.Router();
const Post = require('../../models/post');

// Create a route to get a random selection of up to 40 posts
router.get('/', async (req, res) => {
  try {
    // Use the $sample operator to retrieve a random selection of up to 40 posts
    const randomPosts = await Post.aggregate([
      { $sample: { size: 40 } },
    ]);

    res.status(200).json(randomPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
