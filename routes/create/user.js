const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const Customermodel = require('../../models/user');

router.post('/', async (req, res) => {
  try {
    console.log("Processing a request to Register");
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }
    if (password.length < 6) {
      return res.status(400).json({ msg: "Password is too short." });
    }
    const usernameTaken = await Customermodel.findOne({ username });
    if (usernameTaken) {
      return res.status(409).json({ msg: "This username is already taken." });
    }
    const emailTaken = await Customermodel.findOne({ email });
    if (emailTaken) {
      return res.status(409).json({ msg: "This email is already taken." });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newCustomer = new Customermodel({
      username,
      email,
      password: passwordHash,
    });
    const savedCustomer = await newCustomer.save();
    return res.status(201).json({ savedCustomer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
