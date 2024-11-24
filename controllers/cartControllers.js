const Cart = require('../models/Cart');
const Item = require('../models/Kit');

// Get all cart items
exports.getCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate('items.item');
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Add an item to the cart
exports.postCartItems = async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    let cart = await Cart.findOne();
    if (!cart) {
      cart = new Cart({ items: [] });
    }

    const itemIndex = cart.items.findIndex((i) => i.item.toString() === itemId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      const itemExists = await Item.findById(itemId);
      if (!itemExists) {
        return res.status(404).json({ message: 'Item not found' });
      }
      cart.items.push({ item: itemId, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete an item from the cart
exports.deleteCartItmes = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne();
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((i) => i.item.toString() !== itemId);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

