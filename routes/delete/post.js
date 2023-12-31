const express = require('express');
const router = express.Router();
const Post = require('../../models/post');
const User = require('../../models/user');
const Group = require('../../models/group');
var fetchuser = require('../../middleware/fetchuser')

// Delete a user's post by post ID
router.delete('/user',fetchuser, async (req, res) => {
  try {
    const postId = req.body.postId;
    const userId = req.user.id;

    // Check if the post exists and belongs to the user
    const post = await Post.findOne({ _id: postId, author: userId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized' });
    }

    // Remove the post from the user's posts array
    await User.updateOne({ _id: userId }, { $pull: { posts: postId } });

    // Delete the post from the database
    await post.remove();

    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a group's post by post ID
router.delete('/group',fetchuser,async (req, res) => {
  try {
    const postId = req.body.postId;
    const groupId = req.body.groupId;
    const userId = req.user.id;

    // Check if the post exists
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user is authorized to delete the post
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You are not the author' });
    }

    // Remove the post from the group's posts array
    await Group.updateOne({ _id: groupId}, { $pull: { posts: postId } });

    // Delete the post from the database
    await post.remove();

    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
