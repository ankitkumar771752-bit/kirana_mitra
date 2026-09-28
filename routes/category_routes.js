const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', getCategories);
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

module.exports = router;
