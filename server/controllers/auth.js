const { User } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = require('../config/constants');
const axios = require('axios');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide email and password' 
    });
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+password');

  // Check if user exists
  if (!user) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials' 
    });
  }

  // Check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials' 
    });
  }

  // Send token response (similar to register)
  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });

  res.status(statusCode).json({
    user: user,
    success: true,
    token
  });
};
