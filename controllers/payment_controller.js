const { pool } = require('../config/db');

const createPayment = async (req, res) => {
  try {
    const { orderId, method, providerReference } = req.body;
    if (!orderId || !method) {
      return res.status(400).json({ message: 'Order ID and payment method are required.' });
    }

    const [orderRows] = await pool.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
    if (!orderRows.length) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const order = orderRows[0];
    if (req.user.role !== 'admin' && String(order.user_id) !== String(req.user.id)) {
      return res.status(403).json({ message: 'You can only create payments for your own orders.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO payments (order_id, amount, payment_method, payment_status) VALUES (?, ?, ?, ?)',
      [order.id, order.total_amount || order.totalAmount || 0, method, 'pending']
    );

    const [rows] = await pool.execute('SELECT * FROM payments WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment.', error: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    let query = 'SELECT * FROM payments';
    const params = [];
    if (req.user.role !== 'admin') {
      query += ' WHERE order_id IN (SELECT id FROM orders WHERE user_id = ?)';
      params.push(req.user.id);
    }
    query += ' ORDER BY id DESC';

    const [rows] = await pool.execute(query, params);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments.', error: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update payment status.' });
    }

    const [result] = await pool.execute('UPDATE payments SET payment_status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found.' });
    }

    const [rows] = await pool.execute('SELECT * FROM payments WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment status.', error: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  updatePaymentStatus,
};
