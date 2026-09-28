const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus } = require('../controllers/order_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.post('/', authMiddleware, createOrder);
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
