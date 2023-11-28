const express = require('express');
const router = express.Router();
const Group = require('../../models/group');

// Create a route to get a random selection of up to 40 groups
router.get('/', async (req, res) => {
  try {
    // Fetch random groups without populating
    const randomGroups = await Group.aggregate([{ $sample: { size: 40 } }])
      .exec();

    // Use populate for each reference field individually on the resulting array
    const populatedGroups = await Group.populate(randomGroups, { path: 'creator' });
    await Group.populate(populatedGroups, { path: 'admins' });
    await Group.populate(populatedGroups, { path: 'members' });
    await Group.populate(populatedGroups, { path: 'posts' });

    res.status(200).json(populatedGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
