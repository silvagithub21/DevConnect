const express = require('express');
const db = require('../database');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/projects — Feed público (todos os projetos)
router.get('/', (req, res) => {
  const projects = db.prepare(`
    SELECT p.*, u.name as author_name,
      (SELECT COUNT(*) FROM likes WHERE project_id = p.id) as like_count
    FROM projects p
    JOIN users u ON p.author_id = u.id
    ORDER BY p.created_at DESC
  `).all();

  const result = projects.map(p => ({
    ...p,
    techs: JSON.parse(p.techs || '[]'),
  }));

  res.json(result);
});

// GET /api/projects/mine — Projetos do usuário logado
router.get('/mine', auth, (req, res) => {
  const projects = db.prepare(`
    SELECT p.*,
      (SELECT COUNT(*) FROM likes WHERE project_id = p.id) as like_count
    FROM projects p
    WHERE p.author_id = ?
    ORDER BY p.created_at DESC
  `).all(req.user.id);

  const result = projects.map(p => ({
    ...p,
    techs: JSON.parse(p.techs || '[]'),
  }));

  res.json(result);
});

// POST /api/projects — Criar projeto
router.post('/', auth, (req, res) => {
  const { title, description, github, deploy, techs } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Título é obrigatório.' });
  }

  const result = db.prepare(`
    INSERT INTO projects (title, description, github, deploy, techs, author_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    title,
    description || '',
    github || '',
    deploy || '',
    JSON.stringify(techs || []),
    req.user.id
  );

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ ...project, techs: JSON.parse(project.techs) });
});

// PUT /api/projects/:id — Editar projeto (só o dono)
router.put('/:id', auth, (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);

  if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });
  if (project.author_id !== req.user.id) return res.status(403).json({ error: 'Sem permissão.' });

  const { title, description, github, deploy, techs } = req.body;

  db.prepare(`
    UPDATE projects SET title=?, description=?, github=?, deploy=?, techs=?
    WHERE id=?
  `).run(
    title || project.title,
    description ?? project.description,
    github ?? project.github,
    deploy ?? project.deploy,
    JSON.stringify(techs || JSON.parse(project.techs)),
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json({ ...updated, techs: JSON.parse(updated.techs) });
});

// DELETE /api/projects/:id — Deletar projeto (só o dono)
router.delete('/:id', auth, (req, res) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);

  if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });
  if (project.author_id !== req.user.id) return res.status(403).json({ error: 'Sem permissão.' });

  db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
  res.json({ message: 'Projeto deletado com sucesso.' });
});

// POST /api/projects/:id/like — Curtir / Descurtir
router.post('/:id/like', auth, (req, res) => {
  const projectId = req.params.id;
  const userId = req.user.id;

  const existing = db.prepare('SELECT * FROM likes WHERE user_id=? AND project_id=?').get(userId, projectId);

  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id=? AND project_id=?').run(userId, projectId);
    res.json({ liked: false });
  } else {
    db.prepare('INSERT INTO likes (user_id, project_id) VALUES (?, ?)').run(userId, projectId);
    res.json({ liked: true });
  }
});

module.exports = router;
