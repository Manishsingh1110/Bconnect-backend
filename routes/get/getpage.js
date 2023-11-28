const express = require('express');
const router = express.Router();
const Page = require('../../models/page');
const fetchuser = require('../../middleware/fetchuser');
const bodyParser = require('body-parser');

// Middleware for parsing JSON and URL-encoded data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Route to get a page by ID and populate associated details
router.get('/', fetchuser, async (req, res) => {
  try {
    const { pageId } = req.body;

    // Find the page by ID and populate associated details
    const page = await Page.findById(pageId)
      .populate({
        path: 'posts',
        model: 'Post',
      })

    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }

    res.status(200).json(page);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
