// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const Admin = require('../models/Admin');

const mongoUri = process.env.MONGO_URI;

console.log('MONGO_URI:', mongoUri); // Aggiungi questa linea per il debug

if (!mongoUri) {
  console.error('MONGO_URI is not defined in the .env file');
  process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    const username = 'admin';
    const password = 'adminpassword';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      password: hashedPassword
    });

    await newAdmin.save();
    console.log('Admin created');
    mongoose.connection.close();
  })
  .catch(err => console.log(err));


