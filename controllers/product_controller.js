const { pool } = require('../config/db');

const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC
    `);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ? LIMIT 1
    `, [req.params.id]);

    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product.', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { store_id, category_id, name, price, stock, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Product name and price are required.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO products (store_id, category_id, name, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
      [store_id || null, category_id || null, name, price, stock || 0, image || null]
    );

    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product.', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, stock, image, category_id, store_id } = req.body;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (stock !== undefined) { updates.push('stock = ?'); values.push(stock); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    if (category_id !== undefined) { updates.push('category_id = ?'); values.push(category_id); }
    if (store_id !== undefined) { updates.push('store_id = ?'); values.push(store_id); }

    if (!updates.length) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    values.push(req.params.id);
    const [result] = await pool.execute(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product.', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product.', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
