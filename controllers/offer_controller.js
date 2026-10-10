const { pool } = require('../config/db');

const getOffers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM offers ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch offers.', error: error.message });
  }
};

const createOffer = async (req, res) => {
  try {
    const { title, discount, coupon_code } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO offers (title, discount, coupon_code) VALUES (?, ?, ?)',
      [title || '', discount || 0, coupon_code || '']
    );
    const [rows] = await pool.execute('SELECT * FROM offers WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create offer.', error: error.message });
  }
};

const updateOffer = async (req, res) => {
  try {
    const { title, discount, coupon_code } = req.body;
    const updates = [];
    const values = [];
    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (discount !== undefined) { updates.push('discount = ?'); values.push(discount); }
    if (coupon_code !== undefined) { updates.push('coupon_code = ?'); values.push(coupon_code); }
    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }
    values.push(req.params.id);
    const [result] = await pool.execute(`UPDATE offers SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Offer not found.' });
    }
    const [rows] = await pool.execute('SELECT * FROM offers WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update offer.', error: error.message });
  }
};

const deleteOffer = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM offers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Offer not found.' });
    }
    res.status(200).json({ message: 'Offer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete offer.', error: error.message });
  }
};

module.exports = {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
};
