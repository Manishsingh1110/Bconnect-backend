const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// Create a route to create a new group
router.post('/', async (req, res) => {
  try {
    const { name, description, imageUrl, creator } = req.body;

    // Ensure that the creator field is provided
    if (!creator) {
      return res.status(400).json({ message: 'Creator is required' });
    }

    // Create a new group with the creator as the first admin
    const newGroup = new Group({
      name,
      description,
      imageUrl,
      creator,
      admins: [creator]
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
