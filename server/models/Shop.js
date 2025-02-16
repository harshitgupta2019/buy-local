const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a shop name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    address: {
      street: {
        type: String,
        required: [true, 'Please add street address'],
      },
      city: {
        type: String,
        required: [true, 'Please add city'],
      },
      state: {
        type: String,
        required: [true, 'Please add state'],
      },
      zip: {
        type: String,
        required: [true, 'Please add ZIP code'],
      },
    },
      phone: {
        type: String,
        required: [true, 'Please add a contact number'],
      },
    category: {
      type: String,
      required: [true, 'Please select a category'],
    },
    openingTime: {
      type: String,
      required: [true, 'Please add opening time'],
    },
    closingTime: {
      type: String,
      required: [true, 'Please add closing time'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String, // URL to the uploaded image
      default: '', // Optional, can be empty
    },
  },
  {
    timestamps: true,
  }
);

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
