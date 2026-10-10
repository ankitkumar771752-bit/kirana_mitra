const { pool } = require('../config/db');

const getNotifications = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications.', error: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { user_id, message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Notification message is required.' });
    }
    const [result] = await pool.execute(
      'INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, ?)',
      [user_id || req.user.id, message, 0]
    );
    const [rows] = await pool.execute('SELECT * FROM notifications WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create notification.', error: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const [result] = await pool.execute('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found.' });
    }
    const [rows] = await pool.execute('SELECT * FROM notifications WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update notification.', error: error.message });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markNotificationRead,
};
