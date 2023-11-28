const express = require('express');
const router = express.Router();
const Group = require('../../models/group');
const fetchuser = require('../../middleware/fetchuser');
const bodyParser = require('body-parser');
const firebaseApp = require('firebase/app');
const firebaseStorage = require('firebase/storage');
const config = require('../../config');
const multer = require('multer');

// Initialize a firebase application
firebaseApp.initializeApp(config.firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = firebaseStorage.getStorage();

const upload = multer({ storage: multer.memoryStorage() });

// Middleware for parsing JSON and URL-encoded data
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.post('/', fetchuser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'backgroundavatar', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, description,industriesproduct,location } = req.body;
    const creator = req.user.id;

    // Ensure that the creator field is provided
    if (!creator) {
      return res.status(400).json({ message: 'Creator is required' });
    }

    const avatarFile = req.files['avatar'][0];
    const backgroundAvatarFile = req.files['backgroundavatar'][0];

    let avatarURL = '';
    let backgroundAvatarURL = '';

    const dateTime = giveCurrentDateTime();

    // Handle avatar image upload
    const avatarStorageRef = firebaseStorage.ref(storage, `ProfilePic/${avatarFile.originalname + ' ' + dateTime}`);
    const avatarMetadata = { contentType: 'image/png' };
    const avatarSnapshot = await firebaseStorage.uploadBytesResumable(avatarStorageRef, avatarFile.buffer, avatarMetadata);
    avatarURL = await firebaseStorage.getDownloadURL(avatarSnapshot.ref);

    // Handle background image upload
    const backgroundStorageRef = firebaseStorage.ref(storage, `BackgroundPic/${backgroundAvatarFile.originalname + ' ' + dateTime}`);
    const backgroundMetadata = { contentType: 'image/png' };
    const backgroundSnapshot = await firebaseStorage.uploadBytesResumable(backgroundStorageRef, backgroundAvatarFile.buffer, backgroundMetadata);
    backgroundAvatarURL = await firebaseStorage.getDownloadURL(backgroundSnapshot.ref);

    // Create a new group with the creator as the first admin
    const newGroup = new Group({
      name,
      description,
      imageUrl: avatarURL,
      backgroundimageUrl: backgroundAvatarURL,
      creator,
      location,
      industriesproduct,
      admins: [creator],
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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


