const { Product, Shop } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const multer = require('multer');

exports.getProducts = asyncHandler(async (req, res) => {
  const { shopId, category } = req.query;
  let query = {};
  
  if (shopId) query.shop = shopId;
  if (category) query.category = category;
  
  const products = await Product.find(query).populate('shop', 'name');
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('shop', 'name');
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: product
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

exports.createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body,
    image: req.file ? req.file.filename : null 
  };

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    data: product
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  // Check ownership
  const shop = await Shop.findOne({
    _id: product.shop,
    owner: req.user.id
  });
  
  if (!shop) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this product'
    });
  }
  const productsData = {
    ...req.body

  }
  product = await Product.findByIdAndUpdate(req.params.id, productsData, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: product
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  // Check ownership
  const shop = await Shop.findOne({
    _id: product.shop,
    owner: req.user.id
  });
  
  if (!shop) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this product'
    });
  }
  
  await product.deleteOne({id: req.params.id});
  
  res.status(200).json({
    success: true,
    data: {}
  });
});