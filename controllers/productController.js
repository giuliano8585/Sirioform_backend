const Product = require("../models/Product");

const createProduct =  async (req, res) => {
    const { code, title, description, price1, price2, price3 } = req.body;
    try {
      const newProduct = new Product({
        code,
        title,
        description,
        price1,
        price2,
        price3
      });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error, product could not be created' });
    }
  }

  const getProduct = async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error, could not retrieve products' });
    }
  }


module.exports = {createProduct,getProduct };