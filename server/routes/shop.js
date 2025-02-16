const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getShops, createShop, getShopById } = require('../controllers/shop');
const { protect, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
      // Create unique filename
      const uniqueSuffix = Date.now() + '-' + file.originalname;
      cb(null, uniqueSuffix);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router
  .route('/')
  .get(getShops)
  .post(protect, authorize(USER_ROLES.SHOP_OWNER), upload.single('image'), createShop);

router.get('/:id', getShopById);

module.exports = router;
