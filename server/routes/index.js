const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const shopRoutes = require('./shop');
const productRoutes = require('./product');
const orderRoutes = require('./order');

router.use('/auth', authRoutes);
router.use('/shops', shopRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

module.exports = router;