const { pool } = require('../config/db');

const getAddresses = async (req, res) => {
  try {
    const [rows] = req.user && req.user.role === 'admin'
      ? await pool.execute('SELECT * FROM addresses ORDER BY id DESC')
      : await pool.execute('SELECT * FROM addresses WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch addresses.', error: error.message });
  }
};

const createAddress = async (req, res) => {
  try {
    const { address, city, pincode } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO addresses (user_id, address, city, pincode) VALUES (?, ?, ?, ?)',
      [req.user.id, address || '', city || '', pincode || '']
    );
    const [rows] = await pool.execute('SELECT * FROM addresses WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create address.', error: error.message });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { address, city, pincode } = req.body;
    const updates = [];
    const values = [];
    if (address !== undefined) { updates.push('address = ?'); values.push(address); }
    if (city !== undefined) { updates.push('city = ?'); values.push(city); }
    if (pincode !== undefined) { updates.push('pincode = ?'); values.push(pincode); }
    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }
    values.push(req.params.id);
    const [result] = await pool.execute(`UPDATE addresses SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found.' });
    }
    const [rows] = await pool.execute('SELECT * FROM addresses WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update address.', error: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM addresses WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found.' });
    }
    res.status(200).json({ message: 'Address deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete address.', error: error.message });
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
