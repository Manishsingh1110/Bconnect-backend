const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const Customermodel = require('../../models/user');
var fetchuser = require('../../middleware/fetchuser')

// Create a route to delete a user account
router.delete('/',fetchuser, async (req, res) => {
  try {
    try {
      const {password} = req.body;   
    
      const userId = req.user.id;

      // Verify the provided email and password
      const user = await Customermodel.findOne({ _id: userId });

      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ msg: 'Unauthorized: Invalid password' });
      }

      // Delete the user account
      await Customermodel.deleteOne({ _id: userId });
      res.status(200).json({ msg: 'User account deleted' });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
