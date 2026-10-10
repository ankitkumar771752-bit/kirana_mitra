const { pool } = require('../config/db');

const getDeliveries = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT o.*, u.name AS customer_name, dp.vehicle_number
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      LEFT JOIN delivery_partners dp ON dp.id = o.delivery_partner_id
      WHERE o.delivery_partner_id IS NOT NULL OR o.order_status IN ('pending', 'confirmed')
      ORDER BY o.created_at DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deliveries.', error: error.message });
  }
};

const createDelivery = async (req, res) => {
  try {
    const { orderId, assignedTo } = req.body;
    const [orderRows] = await pool.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
    if (!orderRows.length) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const [result] = await pool.execute(
      'UPDATE orders SET delivery_partner_id = ?, order_status = ? WHERE id = ?',
      [assignedTo || null, assignedTo ? 'confirmed' : 'pending', orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Delivery not created.' });
    }

    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create delivery.', error: error.message });
  }
};

const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const updates = [];
    const values = [];

    if (status !== undefined) { updates.push('order_status = ?'); values.push(status); }
    if (assignedTo !== undefined) { updates.push('delivery_partner_id = ?'); values.push(assignedTo || null); }

    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    values.push(req.params.id);
    const [result] = await pool.execute(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Delivery not found.' });
    }

    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update delivery status.', error: error.message });
  }
};

module.exports = {
  getDeliveries,
  createDelivery,
  updateDeliveryStatus,
};
