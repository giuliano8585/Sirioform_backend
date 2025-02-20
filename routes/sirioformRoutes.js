const express = require('express');
const { getAllSirioform } = require("../controllers/sirioformController");
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();


router.get('/', getAllSirioform);

module.exports = router;
