const express = require('express');
const { getReviews, createReview, updateReview, deleteReview } = require('../controllers/review_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', getReviews);
router.post('/', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
