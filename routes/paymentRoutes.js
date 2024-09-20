const express = require('express');
const { createPaymentSession } = require('../controllers/paymentController');

const router = express.Router();

router.post('/checkout', createPaymentSession);

module.exports = router;
