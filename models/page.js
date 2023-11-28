const mongoose = require('mongoose');

// Define Company Schema
const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  salesDetails: [
    {
      product: String,
      quantity: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  rawMaterials: [
    {
      materialName: String,
      materialdetails: String
    },
  ],

  byProducts: [
    {
      byProductName: String,
      byProductDescription: String,
      usibility: String,
      imageurl: String,
    },
  ],
});

// Create Page Model
const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
