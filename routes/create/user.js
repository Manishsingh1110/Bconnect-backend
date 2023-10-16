const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf'); // Import the 'rimraf' library for directory removal
const  User  = require('../../models/user');

const uploadDirectory = 'uploads/avatars';

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.username;
    const userUploadsDir = path.join(uploadDirectory, username);

    if (!fs.existsSync(userUploadsDir)) {
      fs.mkdirSync(userUploadsDir, { recursive: true });
    }

    cb(null, userUploadsDir);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(null, 'avatar_' + Date.now() + extname);
  },
});

const upload = multer({ storage });

router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    console.log("Processing a request to Register");
    const {
      username,
      email,
      password,
      companyname,
      companyscale,
      Products,
      firstname,
      lastname,
      description,
    } = req.body;
    console.log(req.body)

    if (!username || !email || !password || !companyname || !companyscale) {
      // If there's an error, delete the uploaded file and the user's directory
      if (req.file) {
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
      }
      const userUploadsDir = path.join(uploadDirectory, username);
      rimraf.sync(userUploadsDir); // Delete the user's directory
      return res.status(400).json({ msg: "Not all required fields have been entered" });
    }

    if (password.length < 6) {
      if (req.file) {
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
      }
      const userUploadsDir = path.join(uploadDirectory, username);
      rimraf.sync(userUploadsDir);
      return res.status(400).json({ msg: "Password is too short." });
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      if (req.file) {
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
      }
      const userUploadsDir = path.join(uploadDirectory, username);
      rimraf.sync(userUploadsDir);
      return res.status(409).json({ msg: "This username is already taken." });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      if (req.file) {
        const filePath = req.file.path;
        fs.unlinkSync(filePath);
      }
      const userUploadsDir = path.join(uploadDirectory, username);
      rimraf.sync(userUploadsDir);
      return res.status(409).json({ msg: "This email is already taken." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const avatar = req.file ? req.file.path : '';

    const newCustomer = new User({
      username,
      email,
      password: passwordHash,
      companyname,
      companyscale,
      Products,
      firstname,
      lastname,
      description,
      avatar,
    });

    const savedCustomer = await newCustomer.save();
    return res.status(201).json({ savedCustomer });
  } catch (error) {
    console.error(error);
    if (req.file) {
      const filePath = req.file.path;
      fs.unlinkSync(filePath);
    }
    const userUploadsDir = path.join(uploadDirectory, req.body.username);
    rimraf.sync(userUploadsDir); // Delete the user's directory
    return res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
