const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../../models/user');
const bodyParser = require('body-parser');
const firebaseApp = require('firebase/app');
const firebaseStorage = require('firebase/storage');
const config = require('../../config');

// Initialize a firebase application
firebaseApp.initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = firebaseStorage.getStorage();

const upload = multer({ storage: multer.memoryStorage() });
// Middleware for parsing JSON and URL-encoded data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    console.log('Processing a request to Register');
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
      profileType,
      aboutus,
    } = req.body;

    if (!username || !email || !password || !companyname || !companyscale) {
      return res.status(400).json({ msg: 'Not all required fields have been entered' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password is too short.' });
    }

    const usernameTaken = await User.findOne({ username });
    if (usernameTaken) {
      return res.status(409).json({ msg: 'This username is already taken.' });
    }

    const emailTaken = await User.findOne({ email });
    if (emailTaken) {
      return res.status(409).json({ msg: 'This email is already taken.' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    let avatarURL = '';

    const dateTime = giveCurrentDateTime();

    const storageRef = firebaseStorage.ref(storage, `ProfilePic/${req.file.originalname + ' ' + dateTime}`);

    // Create file metadata including the content type
    const metadata = {
      contentType: 'image/png',
    };

    // Upload the file to Firebase Storage
    const snapshot = await firebaseStorage.uploadBytesResumable(storageRef, req.file.buffer, metadata);

    // Grab the public URL
    avatarURL = await firebaseStorage.getDownloadURL(snapshot.ref);

    const newCustomer = new User({
      username,
      email,
      password: passwordHash,
      companyname,
      companyscale,
      Products: JSON.parse(Products),
      firstname,
      lastname,
      description,
      avatar: avatarURL, // Set the avatar to the Firebase Storage URL
      profileType,
      aboutus,
    });

    const savedCustomer = await newCustomer.save();
    return res.status(201).json({ savedCustomer });
  } catch (error) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

const giveCurrentDateTime = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
};

module.exports = router;
