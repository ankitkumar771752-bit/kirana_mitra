const express = require('express');
const { getDeliveries, createDelivery, updateDeliveryStatus } = require('../controllers/delivery_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', authMiddleware, getDeliveries);
router.post('/', authMiddleware, createDelivery);
router.put('/:id/status', authMiddleware, updateDeliveryStatus);

module.exports = router;
