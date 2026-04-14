const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
require('dotenv').config();

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'E-mail já cadastrado.' });
  }

  const hashed = bcrypt.hashSync(password, 10);

  const result = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  ).run(name, email, hashed);

  const user = { id: result.lastInsertRowid, name, email };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({ token, user });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  const found = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!found) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const valid = bcrypt.compareSync(password, found.password);
  if (!valid) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const user = { id: found.id, name: found.name, email: found.email };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, user });
});

module.exports = router;
