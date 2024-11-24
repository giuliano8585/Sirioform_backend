const express = require('express');
const { getCartItems, postCartItems, deleteCartItmes } = require('../controllers/cartControllers');
const router = express.Router();

// Get all cart items
router.get('/',getCartItems);

// Add an item to the cart
router.post('/',postCartItems);

// Delete an item from the cart
router.delete('/:itemId', deleteCartItmes);

module.exports = router;
