const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '90d' }
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const [existingRows] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
    if (existingRows.length > 0) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = 'customer';

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, normalizedEmail, hashedPassword, phone || '', userRole]
    );

    const user = {
      id: result.insertId,
      name,
      email: normalizedEmail,
      role: userRole,
    };

    res.status(201).json({
      message: 'User registered successfully.',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [normalizedEmail]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = generateToken(userData);

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
