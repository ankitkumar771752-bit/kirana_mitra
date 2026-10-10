const { pool } = require('../config/db');

const getDeliveryPartners = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT dp.*, u.name, u.email, u.phone
      FROM delivery_partners dp
      LEFT JOIN users u ON u.id = dp.user_id
      ORDER BY dp.id DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch delivery partners.', error: error.message });
  }
};

const createDeliveryPartner = async (req, res) => {
  try {
    const { user_id, vehicle_number, is_available } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO delivery_partners (user_id, vehicle_number, is_available) VALUES (?, ?, ?)',
      [user_id || null, vehicle_number || '', is_available === undefined ? 1 : Number(is_available)]
    );
    const [rows] = await pool.execute('SELECT * FROM delivery_partners WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create delivery partner.', error: error.message });
  }
};

const updateDeliveryPartner = async (req, res) => {
  try {
    const { user_id, vehicle_number, is_available } = req.body;
    const updates = [];
    const values = [];
    if (user_id !== undefined) { updates.push('user_id = ?'); values.push(user_id); }
    if (vehicle_number !== undefined) { updates.push('vehicle_number = ?'); values.push(vehicle_number); }
    if (is_available !== undefined) { updates.push('is_available = ?'); values.push(Number(is_available)); }
    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }
    values.push(req.params.id);
    const [result] = await pool.execute(`UPDATE delivery_partners SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Delivery partner not found.' });
    }
    const [rows] = await pool.execute('SELECT * FROM delivery_partners WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update delivery partner.', error: error.message });
  }
};

module.exports = {
  getDeliveryPartners,
  createDeliveryPartner,
  updateDeliveryPartner,
};
