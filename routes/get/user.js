const express = require('express');
const router = express.Router();
const Customermodel = require('../../models/user');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'bconnect';

router.post('/', async (req, res) => {
  try {
    console.log("Processing a request to Login");
    const { email, password } = req.body;
    console.log(req.body)
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have entered",email,password });
    }
    const user = await Customermodel.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    const data = {
      user: {
        id: user._id,
      },
    };
    const jwttoken = jwt.sign(data, JWT_SECRET);
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;
    res.json({ jwttoken, customer: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
