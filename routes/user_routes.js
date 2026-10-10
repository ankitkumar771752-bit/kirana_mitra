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
const requireRole = require('../middleware/role_middleware');

const router = express.Router();

router.get('/profile', authMiddleware, getCustomerProfile);
router.put('/profile', authMiddleware, updateCustomerProfile);
router.get('/', authMiddleware, requireRole('admin'), getUsers);
router.get('/:id', authMiddleware, requireRole('admin'), getUserById);
router.post('/', authMiddleware, requireRole('admin'), createUser);
router.put('/:id', authMiddleware, requireRole('admin'), updateUser);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteUser);

module.exports = router;
