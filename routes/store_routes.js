const express = require('express');
const { getStores, getStoreById, createStore, updateStore, deleteStore } = require('../controllers/store_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', getStores);
router.get('/:id', getStoreById);
router.post('/', authMiddleware, createStore);
router.put('/:id', authMiddleware, updateStore);
router.delete('/:id', authMiddleware, deleteStore);

module.exports = router;
