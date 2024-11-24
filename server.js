const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

connectDB();
const app = express();
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/centers', require('./routes/centers'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api', require('./routes/protected'));
app.use('/api/kits', require('./routes/kits'));
app.use('/api/sanitarios', require('./routes/sanitarios'));

app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/discenti', require('./routes/discenteRoutes'));
app.use('/api/corsi', require('./routes/courseRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
