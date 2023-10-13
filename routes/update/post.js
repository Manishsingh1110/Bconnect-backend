const express = require('express');
const router = express.Router();
const Post = require('../../models/post');

// Update a post
router.put('/', async (req, res) => {
  try {
    const postId = req.bdoy.postId;
    const { postText, postImages, likeCount, comment } = req.body;

    // Check if the post exists
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update post fields
    if (postText) {
      post.postText = postText;
    }

    if (postImages) {
      post.postImages = postImages;
    }

    if (likeCount) {
      post.likeCount = likeCount;
    }

    if (comment) {
      post.comment = comment;
    }

    // Save the updated post
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
