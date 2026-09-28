const express = require('express');
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cart_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, addToCart);
router.put('/:id', authMiddleware, updateCartItem);
router.delete('/:id', authMiddleware, removeCartItem);

module.exports = router;
