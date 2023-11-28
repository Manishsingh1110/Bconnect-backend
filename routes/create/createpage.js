const express = require('express');
const router = express.Router();
const Page = require('../../models/page');
const fetchuser = require('../../middleware/fetchuser');
const bodyParser = require('body-parser');

// Middleware for parsing JSON and URL-encoded data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Route to create a new page
router.post('/', fetchuser, async (req, res) => {
  try {
    const { name, description, rawMaterials, byProducts } = req.body;
    const creator = req.user.id;

    // Ensure that the creator field is provided
    if (!creator) {
      return res.status(400).json({ message: 'Creator is required' });
    }

    // Create a new page with raw materials and byproducts details
    const newPage = new Page({
      name,
      description,
      rawMaterials,
      byProducts,
    });

    // Save the new page
    const savedPage = await newPage.save();

    // Update the user's page field
    await User.findByIdAndUpdate(creator, { $set: { page: savedPage._id } });

    res.status(201).json(savedPage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
