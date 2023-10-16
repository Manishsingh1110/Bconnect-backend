const express = require('express');
const router = express.Router();
const Group = require('../../models/group');

// Create a route to get a random selection of up to 40 groups
router.get('/', async (req, res) => {
  try {
    const randomGroups = await Group.find()
    res.status(200).json(randomGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
