const express = require('express');
const router = express.Router();
const Group = require('../../models/group');

// Update a group
router.put('/', async (req, res) => {
  try {
    const groupId = req.body.groupId;
    const { name, description, imageUrl, members, admins } = req.body;

    // Check if the group exists
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Update group fields
    if (name) {
      group.name = name;
    }

    if (description) {
      group.description = description;
    }

    if (imageUrl) {
      group.imageUrl = imageUrl;
    }

    if (members) {
      group.members = members;
    }

    if (admins) {
      group.admins = admins;
    }

    // Save the updated group
    const updatedGroup = await group.save();
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
