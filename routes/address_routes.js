const express = require('express');
const { getAddresses, createAddress, updateAddress, deleteAddress } = require('../controllers/address_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', authMiddleware, getAddresses);
router.post('/', authMiddleware, createAddress);
router.put('/:id', authMiddleware, updateAddress);
router.delete('/:id', authMiddleware, deleteAddress);

module.exports = router;
