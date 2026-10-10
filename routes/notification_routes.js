const express = require('express');
const { getNotifications, createNotification, markNotificationRead } = require('../controllers/notification_controller');
const authMiddleware = require('../middleware/auth_middleware');

const router = express.Router();

router.get('/', authMiddleware, getNotifications);
router.post('/', authMiddleware, createNotification);
router.put('/:id/read', authMiddleware, markNotificationRead);

module.exports = router;
