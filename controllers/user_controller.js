const { pool } = require('../config/db');

const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user.', error: error.message });
  }
};

const getCustomerProfile = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'Customer profile fetched successfully.',
      user: rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch customer profile.', error: error.message });
  }
};

const updateCustomerProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const [rows] = await pool.execute('SELECT id FROM users WHERE id = ? LIMIT 1', [req.user.id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (phone) {
      updates.push('phone = ?');
      values.push(phone);
    }

    if (updates.length) {
      values.push(req.user.id);
      await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [updatedRows] = await pool.execute('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1', [req.user.id]);

    res.status(200).json({
      message: 'Customer profile updated successfully.',
      user: updatedRows[0],
    });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update customer profile.', error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const [existingRows] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [String(email).trim().toLowerCase()]);
    if (existingRows.length) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hash = await require('bcryptjs').hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, String(email).trim().toLowerCase(), hash, phone || '', role || 'customer']
    );

    res.status(201).json({ id: result.insertId, name, email: String(email).trim().toLowerCase(), phone: phone || '', role: role || 'customer' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user.', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (email) { updates.push('email = ?'); values.push(String(email).trim().toLowerCase()); }
    if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
    if (role) { updates.push('role = ?'); values.push(role); }

    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    values.push(req.params.id);
    const [result] = await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const [rows] = await pool.execute('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update user.', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user.', error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCustomerProfile,
  updateCustomerProfile,
  createUser,
  updateUser,
  deleteUser,
};
