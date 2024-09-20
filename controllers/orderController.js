const Order = require('../models/Order');
const Product = require('../models/Product');

// create order controller
const extractProgressiveNumber = (progressiveNumber) => {
  const parts = progressiveNumber.split('-');
  return parseInt(parts[1], 10);
};

const createOrderController = async (req, res) => {
  console.log('POST /api/orders - Order creation started'); // Log
  const { productIds, quantities } = req.body;

  try {
    if (!req.user || !req.user._id) {
      console.log('User information missing during order creation');
      return res.status(400).json({ message: 'User information is missing.' });
    }

    const orders = await Order.find();
    let maxProgressiveNumber = 0;

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        item.progressiveNumbers.forEach((pn) => {
          const num = extractProgressiveNumber(pn);
          if (num > maxProgressiveNumber) {
            maxProgressiveNumber = num;
          }
        });
      });
    });

    console.log(`Max progressive number found: ${maxProgressiveNumber}`);

    const orderItems = [];
    let totalPrice = 0;
    const currentYear = new Date().getFullYear().toString().slice(-2); // Get last two digits of the year

    for (let i = 0; i < productIds.length; i++) {
      console.log(
        `Processing productId: ${productIds[i]} with quantity: ${quantities[i]}`
      ); // Log
      const product = await Product.findById(productIds[i]);
      if (!product) {
        console.log(`Product not found: ${productIds[i]}`); // Log
        return res
          .status(404)
          .json({ message: `Product with id ${productIds[i]} not found` });
      }

      let price;
      if (quantities[i] <= 10) {
        price = product.price1;
      } else if (quantities[i] <= 20) {
        price = product.price2;
      } else {
        price = product.price3;
      }
      console.log(`Price determined for productId ${productIds[i]}: ${price}`);

      // Generate progressive numbers
      const progressiveNumbers = [];
      for (let j = 0; j < quantities[i]; j++) {
        maxProgressiveNumber++;
        progressiveNumbers.push(
          `${currentYear}-${String(maxProgressiveNumber).padStart(7, '0')}`
        );
      }

      orderItems.push({
        productId: productIds[i],
        quantity: quantities[i],
        price: price,
        progressiveNumbers: progressiveNumbers,
      });

      totalPrice += price * quantities[i];
    }

    const newOrder = new Order({
      userId: req.user._id,
      orderItems: orderItems,
      totalPrice: totalPrice,
    });

    const savedOrder = await newOrder.save();
    console.log('Order successfully created:', savedOrder); // Log
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res
      .status(500)
      .json({ message: 'Server error, order could not be created' });
  }
};

// Funzione per creare un nuovo ordine
const createOrder = async (req, res) => {
  console.log('createOrder function invoked'); // Log
  const { userId, orderItems } = req.body;

  console.log('Order data received:', { userId, orderItems }); // Log dei dati ricevuti

  const order = new Order({
    user: userId,
    orderItems,
    orderDate: Date.now(),
  });

  try {
    const createdOrder = await order.save();
    console.log('Order created and saved:', createdOrder); // Log per confermare la creazione
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error('Error during order creation:', err); // Log per errori
    res.status(500).json({ error: 'Order creation failed' });
  }
};

// Funzione per visualizzare tutti gli ordini (solo per admin)
const getAllOrders = async (req, res) => {
  console.log('--- Entering getAllOrders ---');
  console.log('req.user:', req.user);

  try {
    if (req.user?.role == 'admin') {
      console.log('User is admin, fetching all orders...');
      const orders = await Order.find().populate(
        'orderItems.productId',
        // 'firstName lastName title'
      );
      console.log('Orders fetched with populate:', orders);
      res.json(orders);
    } else {
      console.log(
        'User is not admin, fetching orders for userId:',
        req.user._id
      );
      const orders = await Order.find({ userId: req.user._id });
      console.log('User-specific orders fetched:', orders);
      res.json(orders);
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
  console.log('--- Exiting getAllOrders ---');
};

const getUserOrders = async (req, res) => {
  console.log('GET /api/orders - Fetching user orders'); // Log
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      'orderItems.productId',
      'title'
    );
    console.log('User orders fetched:', orders);
    res.json(orders);
  } catch (err) {
    console.error('Fetching orders error:', err);
    res
      .status(500)
      .json({ message: 'Server error, could not retrieve orders' });
  }
};

// Funzione per ottenere i prodotti acquistati dall'utente
const getProdottiAcquistati = async (req, res) => {
  try {
    // Trova tutti gli ordini dell'utente
    const orders = await Order.find({ userId: req.user._id }).populate(
      'orderItems.productId'
    );
    console.log('acquistati orders : ', orders);

    // Estrai i prodotti acquistati dall'utente con il totale delle quantità
    const prodottiAcquistati = orders.reduce((acc, order) => {
      order.orderItems.forEach((item) => {
        const prodotto = acc.find((prod) =>
          prod._id.equals(item.productId._id)
        );
        if (prodotto) {
          prodotto.quantity += item.quantity;
          prodotto.progressiveNumbers = prodotto.progressiveNumbers.concat(
            item.progressiveNumbers
          );
        } else {
          acc.push({
            _id: item.productId._id,
            title: item.productId.title,
            quantity: item.quantity,
            progressiveNumbers: item.progressiveNumbers || [],
          });
        }
      });
      return acc;
    }, []);

    res.status(200).json(prodottiAcquistati);
  } catch (err) {
    console.error('Errore durante il recupero dei prodotti acquistati:', err);
    res
      .status(500)
      .json({ message: 'Errore durante il recupero dei prodotti acquistati' });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getProdottiAcquistati,
  createOrderController,
  getUserOrders,
}; // Aggiungi la nuova funzione
