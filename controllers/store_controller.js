const { pool } = require('../config/db');

const getStores = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM stores ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores.', error: error.message });
  }
};

const getStoreById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM stores WHERE id = ? LIMIT 1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch store.', error: error.message });
  }
};

const createStore = async (req, res) => {
  try {
    const { owner_id, store_name, address, phone } = req.body;
    if (!store_name || !address) {
      return res.status(400).json({ message: 'Store name and address are required.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO stores (owner_id, store_name, address, phone) VALUES (?, ?, ?, ?)',
      [owner_id || null, store_name, address, phone || '']
    );

    const [rows] = await pool.execute('SELECT * FROM stores WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create store.', error: error.message });
  }
};

const updateStore = async (req, res) => {
  try {
    const { owner_id, store_name, address, phone } = req.body;
    const updates = [];
    const values = [];

    if (owner_id !== undefined) { updates.push('owner_id = ?'); values.push(owner_id); }
    if (store_name) { updates.push('store_name = ?'); values.push(store_name); }
    if (address) { updates.push('address = ?'); values.push(address); }
    if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }

    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    values.push(req.params.id);
    const [result] = await pool.execute(`UPDATE stores SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const [rows] = await pool.execute('SELECT * FROM stores WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update store.', error: error.message });
  }
};

const deleteStore = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM stores WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found.' });
    }
    res.status(200).json({ message: 'Store deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete store.', error: error.message });
  }
};

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};
