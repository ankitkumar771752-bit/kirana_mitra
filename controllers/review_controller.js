const { pool } = require('../config/db');

const getReviews = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT r.*, u.name AS user_name, p.name AS product_name
      FROM reviews r
      LEFT JOIN users u ON u.id = r.user_id
      LEFT JOIN products p ON p.id = r.product_id
      ORDER BY r.id DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews.', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { product_id, rating, comment, user_id } = req.body;
    if (!product_id || !rating) {
      return res.status(400).json({ message: 'product_id and rating are required.' });
    }
    const [result] = await pool.execute(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [user_id || req.user.id, product_id, rating, comment || '']
    );
    const [rows] = await pool.execute('SELECT * FROM reviews WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create review.', error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const updates = [];
    const values = [];
    if (rating !== undefined) { updates.push('rating = ?'); values.push(rating); }
    if (comment !== undefined) { updates.push('comment = ?'); values.push(comment); }
    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }
    values.push(req.params.id);
    const [result] = await pool.execute(`UPDATE reviews SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    const [rows] = await pool.execute('SELECT * FROM reviews WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update review.', error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    res.status(200).json({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete review.', error: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
