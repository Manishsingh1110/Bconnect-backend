const express = require('express');
const router = express.Router();
const Group = require('../../models/group');

// Create a route to get a random selection of up to 40 groups
router.get('/', async (req, res) => {
  try {
    // Use the $sample operator to retrieve a random selection of up to 40 groups
    const randomGroups = await Group.aggregate([
      { $sample: { size: 40 } }, // You can adjust the size as needed
    ]);
    res.status(200).json(randomGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
