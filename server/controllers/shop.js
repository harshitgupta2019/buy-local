const { Shop } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const multer = require('multer');
const path = require('path');


exports.getShops = asyncHandler(async (req, res) => {
  const { city, category } = req.query;
  let query = {};
  
  if (city) query['address.city'] = city;
  if (category) query.category = category;
  
  const shops = await Shop.find(query);
  
  res.status(200).json({
    success: true,
    count: shops.length,
    data: shops
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single('image'); // 'image' field name must match frontend

// Middleware for handling image uploads
exports.uploadShopImage = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Create Shop with Image
exports.createShop = asyncHandler(async (req, res) => {
  try {
    const shopData = {
      ...req.body,
      address: JSON.parse(req.body.address),
      image: req.file ? req.file.filename : null,
      owner: req.user._id
  };

    const shop = await Shop.create(shopData);
    res.status(201).json(shop);
  } catch (error) {
    console.error('Shop creation error:', error);
    res.status(400).json({ message: error.message || 'Failed to create shop' });
  }
});


exports.getShopById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: 'Invalid shop ID' });
    // }

    const shop = await Shop.findById(id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.error('Error fetching shop by ID:', error);
    res.status(500).json({ message: 'Error fetching shop', error: error.message });
  }
});