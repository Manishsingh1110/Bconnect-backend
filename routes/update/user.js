const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const Group = require('../../models/group');
const fetchuser = require('../../middleware/fetchuser');

// Update user profile
router.put('/profile',fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { profile } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's profile
    if (profile) {
      user.profile = {
        ...user.profile,
        ...profile,
      };
    }

    // Save the updated user
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add friends to a user
router.put('/friends',fetchuser, async (req, res) => {
    try {
      const userId = req.user.id;
      const { friends } = req.body;
  
      // Check if the user exists
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Add friends
      if (!user.friends.includes(friends)) {
        user.friends.push(friends);
      }
      // Save the updated user
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  

// Join groups
router.put('/groups',fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { groups } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Join groups
    if (groups && Array.isArray(groups)) {
      for (const groupId of groups) {
        // Check if the group exists
        const group = await Group.findById(groupId);

        if (!group) {
          return res.status(404).json({ message: `Group with ID ${groupId} not found` });
        }

        // Check if the user is not already a member
        if (!user.groups.includes(groupId)) {
          user.groups.push(groupId);
        }
      }
    }

    // Save the updated user
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
