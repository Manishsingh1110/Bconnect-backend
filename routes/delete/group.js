const express = require('express');
const router = express.Router();
const Group = require('../../models/group');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

// Create a route to delete a group
router.delete('/', async (req, res) => {
  try {
    const { creatorPassword , groupId } = req.body;

    // Find the group by ID
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Find the creator by ID
    const creator = await User.findById(group.creator);

    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    // Verify the provided password
    const passwordMatch = await bcrypt.compare(creatorPassword, creator.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Unauthorized: Invalid password' });
    }

    // Remove the group from the database
    await group.remove();

    res.status(200).json({ message: 'Group deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
