const { Order, Shop, Product } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const { ORDER_STATUS } = require('../config/constants');

exports.getOrders = asyncHandler(async (req, res) => {
  let query = {};
  if (req.query && Object.keys(req.query).length > 0){
    query.shop = { $in: req.query.shopId };
  }
  // If user is customer, show their orders
  else if (req.user.role === 'customer') {
    query.user = req.user.id;
  }
  // If user is shop owner, show orders for their shops
  else if (req.user.role === 'shop_owner') {
    const shops = await Shop.find({ owner: req.user.id });
    const shopIds = shops.map(shop => shop._id);
    query.shop = { $in: shopIds };
  }
  
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('shop', 'name')
    .populate({
      path: 'products.product',  
      select: 'name'   
    })
  
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('shop', 'name')
    .populate('products.product', 'name price');
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  // Check if user has permission to view this order
  if (
    req.user.role === 'customer' && 
    order.user.toString() !== req.user.id
  ) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view this order'
    });
  }
  
  if (req.user.role === 'shop_owner') {
    const shop = await Shop.findOne({
      _id: order.shop,
      owner: req.user.id
    });
    
    if (!shop) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this order'
      });
    }
  }
  
  res.status(200).json({
    success: true,
    data: order
  });
});

exports.createOrder = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;
  
  // Calculate total amount and verify products
  let totalAmount = 0;
  for (let item of req.body.products) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product ${item.product} not found`
      });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock for product ${product.name}`
      });
    }
    item.price = product.price;
    totalAmount += product.price * item.quantity;
  }
  
  req.body.totalAmount = totalAmount;
  
  const order = await Order.create(req.body);
  
  // Update product stock
  for (let item of req.body.products) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity }
    });
  }
  
  res.status(201).json({
    success: true,
    data: order
  });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!Object.values(ORDER_STATUS).includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status'
    });
  }
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }
  
  // Verify shop owner owns the shop
  const shop = await Shop.findOne({
    _id: order.shop,
    owner: req.user.id
  });
  
  if (!shop) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this order'
    });
  }
  
  order.status = status;
  await order.save();
  
  res.status(200).json({
    success: true,
    data: order
  });
});