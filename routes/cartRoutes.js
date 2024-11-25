const express = require('express');
const {
  getCartItems,
  postCartItems,
  deleteCartItmes,
} = require('../controllers/cartControllers');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all cart items
router.get('/', auth, getCartItems);

// Add an item to the cart
router.post('/', auth, postCartItems);

// Delete an item from the cart
router.delete('/:itemId', auth, deleteCartItmes);

module.exports = router;
