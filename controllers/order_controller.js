const { pool } = require('../config/db');

const createOrder = async (req, res) => {
  try {
    const { user_id, store_id, payment_method, items = [] } = req.body;
    if (!user_id || !items.length) {
      return res.status(400).json({ message: 'user_id and items are required.' });
    }

    let totalAmount = 0;
    for (const item of items) {
      const [productRows] = await pool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [item.product_id]);
      if (!productRows.length) {
        return res.status(404).json({ message: `Product ${item.product_id} not found.` });
      }
      totalAmount += Number(productRows[0].price) * Number(item.quantity || 1);
    }

    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, store_id, total_amount, order_status, payment_method) VALUES (?, ?, ?, ?, ?)',
      [user_id, store_id || null, totalAmount, 'pending', payment_method || null]
    );

    const orderId = result.insertId;
    for (const item of items) {
      const [productRows] = await pool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [item.product_id]);
      await pool.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity || 1, productRows[0].price]
      );
    }

    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
    const [orderItems] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    res.status(201).json({ ...rows[0], items: orderItems });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create order.', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
    const result = [];
    for (const order of orders) {
      const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      result.push({ ...order, items });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    const [items] = await pool.execute('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    res.status(200).json({ ...rows[0], items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order.', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await pool.execute('UPDATE orders SET order_status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    const [rows] = await pool.execute('SELECT * FROM orders WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order status.', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
};
