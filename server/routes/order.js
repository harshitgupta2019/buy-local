const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus
} = require('../controllers/order');
const { protect, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/constants');

router
  .route('/')
  .get(protect, getOrders)
  .post(protect, authorize(USER_ROLES.CUSTOMER), createOrder);

router
  .route('/:id')
  .get(protect, getOrder);

router
  .route('/:id/status')
  .put(protect, authorize(USER_ROLES.SHOP_OWNER), updateOrderStatus);

module.exports = router;