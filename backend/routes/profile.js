const express = require('express');
const db = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/profile — Ver perfil do usuário logado
router.get('/', auth, (req, res) => {
  const user = db.prepare(
    'SELECT id, name, email, bio, github, linkedin, skills, created_at FROM users WHERE id = ?'
  ).get(req.user.id);

  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

  res.json({ ...user, skills: JSON.parse(user.skills || '[]') });
});

// PUT /api/profile — Editar perfil
router.put('/', auth, (req, res) => {
  const { name, bio, github, linkedin, skills } = req.body;

  db.prepare(`
    UPDATE users SET
      name = COALESCE(?, name),
      bio = COALESCE(?, bio),
      github = COALESCE(?, github),
      linkedin = COALESCE(?, linkedin),
      skills = COALESCE(?, skills)
    WHERE id = ?
  `).run(
    name || null,
    bio !== undefined ? bio : null,
    github !== undefined ? github : null,
    linkedin !== undefined ? linkedin : null,
    skills ? JSON.stringify(skills) : null,
    req.user.id
  );

  const updated = db.prepare(
    'SELECT id, name, email, bio, github, linkedin, skills FROM users WHERE id = ?'
  ).get(req.user.id);

  res.json({ ...updated, skills: JSON.parse(updated.skills || '[]') });
});

module.exports = router;
