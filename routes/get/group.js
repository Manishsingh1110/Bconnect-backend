const express = require('express');
const router = express.Router();
const Group = require('../../models/group');

// Create a route to get a random selection of up to 40 groups
router.get('/', async (req, res) => {
  try {
    // Fetch random groups and populate all fields for the referenced documents
    const randomGroups = await Group.aggregate([{ $sample: { size: 40 } }])
    .exec();

  // Use populate for each reference field individually
  await Group.populate(randomGroups, { path: 'creator' });
  await Group.populate(randomGroups, { path: 'admins' });
  await Group.populate(randomGroups, { path: 'members' });
  await Group.populate(randomGroups, { path: 'posts' });

    res.status(200).json(randomGroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
