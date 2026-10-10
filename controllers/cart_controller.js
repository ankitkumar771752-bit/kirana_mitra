const { pool } = require('../config/db');

const getCart = async (req, res) => {
  try {
    const [cartRows] = await pool.execute('SELECT * FROM carts WHERE user_id = ? LIMIT 1', [req.user.id]);
    if (!cartRows.length) {
      return res.status(200).json({ user_id: req.user.id, items: [] });
    }

    const cart = cartRows[0];
    const [items] = await pool.execute(`
      SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image
      FROM cart_items ci
      LEFT JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = ?
    `, [cart.id]);

    res.status(200).json({ ...cart, items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart.', error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'A productId and positive integer quantity are required.' });
    }

    const [productRows] = await pool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [productId]);
    if (!productRows.length) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const product = productRows[0];
    let [cartRows] = await pool.execute('SELECT * FROM carts WHERE user_id = ? LIMIT 1', [req.user.id]);
    let cart;

    if (!cartRows.length) {
      const [createResult] = await pool.execute('INSERT INTO carts (user_id) VALUES (?)', [req.user.id]);
      cart = { id: createResult.insertId, user_id: req.user.id };
    } else {
      cart = cartRows[0];
    }

    const [itemRows] = await pool.execute('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1', [cart.id, productId]);
    const newQty = (itemRows[0] ? itemRows[0].quantity : 0) + Number(quantity);
    if (newQty > product.stock) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock.' });
    }

    if (itemRows.length) {
      await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, itemRows[0].id]);
    } else {
      await pool.execute('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cart.id, productId, quantity]);
    }

    const [items] = await pool.execute(`SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image FROM cart_items ci LEFT JOIN products p ON p.id = ci.product_id WHERE ci.cart_id = ?`, [cart.id]);
    res.status(201).json({ ...cart, items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item to cart.', error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer.' });
    }

    const [itemRows] = await pool.execute('SELECT * FROM cart_items WHERE id = ? LIMIT 1', [req.params.id]);
    if (!itemRows.length) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    const item = itemRows[0];
    const [productRows] = await pool.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [item.product_id]);
    if (!productRows.length || quantity > productRows[0].stock) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock.' });
    }

    await pool.execute('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);
    const [items] = await pool.execute(`SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image FROM cart_items ci LEFT JOIN products p ON p.id = ci.product_id WHERE ci.cart_id = ?`, [item.cart_id]);
    res.status(200).json({ cart_id: item.cart_id, items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update cart item.', error: error.message });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const [itemRows] = await pool.execute('SELECT * FROM cart_items WHERE id = ? LIMIT 1', [req.params.id]);
    if (!itemRows.length) {
      return res.status(404).json({ message: 'Cart item not found.' });
    }

    const item = itemRows[0];
    await pool.execute('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
    const [items] = await pool.execute(`SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image FROM cart_items ci LEFT JOIN products p ON p.id = ci.product_id WHERE ci.cart_id = ?`, [item.cart_id]);
    res.status(200).json({ cart_id: item.cart_id, items });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove cart item.', error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
