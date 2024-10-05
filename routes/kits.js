const express = require('express');
const router = express.Router();
const { createKit, getKits, updateKit, deleteKit } = require('../controllers/kitsController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.post('/create', auth,isAdmin, upload.fields([{ name: 'profileImage', maxCount: 1 }]), createKit);
router.patch('/:id', auth,isAdmin,  upload.fields([{ name: 'profileImage', maxCount: 1 }]), updateKit);
router.get('/',auth, getKits);
router.delete('/:id', auth,isAdmin, deleteKit);

module.exports = router;

