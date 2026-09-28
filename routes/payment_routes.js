const express = require('express');
const { createPayment, getPayments, updatePaymentStatus } = require('../controllers/payment_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', authMiddleware, getPayments);
router.post('/', authMiddleware, createPayment);
router.put('/:id/status', authMiddleware, updatePaymentStatus);

module.exports = router;
