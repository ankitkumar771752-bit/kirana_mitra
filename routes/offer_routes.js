const express = require('express');
const { getOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offer_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', getOffers);
router.post('/', authMiddleware, createOffer);
router.put('/:id', authMiddleware, updateOffer);
router.delete('/:id', authMiddleware, deleteOffer);

module.exports = router;
