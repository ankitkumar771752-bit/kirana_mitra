const express = require('express');
const {
  getUsers,
  getUserById,
  getCustomerProfile,
  updateCustomerProfile,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/profile', authMiddleware, getCustomerProfile);
router.put('/profile', authMiddleware, updateCustomerProfile);
router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;
