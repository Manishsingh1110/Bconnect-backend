const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const Customermodel = require('../../models/user');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'bconnect'; // Replace with your actual JWT secret

// Create a route to delete a user account
router.delete('/', async (req, res) => {
  try {
    const {password} = req.body;

    // Verify user authentication before allowing deletion
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded) {
        return res.status(401).json({ msg: 'Unauthorized: Invalid token' });
      }

      const userId = decoded.user.id;

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
