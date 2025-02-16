const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const { protect } = require('../middleware/auth');  // Import the protect middleware

// Route to register a new user
router.post('/register', register);

// Route to login a user
router.post('/login', login);

// Protected route to get current authenticated user's information
router.get('/me', protect, (req, res) => {
  // The user is attached to the request object in the 'protect' middleware
  res.json({
    success: true,
    user: req.user // Send the authenticated user's data
  });
});

module.exports = router;
