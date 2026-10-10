const { pool } = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name ASC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories.', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const [result] = await pool.execute('INSERT INTO categories (name, image) VALUES (?, ?)', [name, image || null]);
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ? LIMIT 1', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category.', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name && !image) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    const updates = [];
    const values = [];
    if (name) { updates.push('name = ?'); values.push(name); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    values.push(req.params.id);

    const [result] = await pool.execute(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ? LIMIT 1', [req.params.id]);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category.', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category.', error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
