const express = require('express');
const { getDeliveryPartners, createDeliveryPartner, updateDeliveryPartner } = require('../controllers/delivery_partner_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', authMiddleware, getDeliveryPartners);
router.post('/', authMiddleware, createDeliveryPartner);
router.put('/:id', authMiddleware, updateDeliveryPartner);

module.exports = router;
