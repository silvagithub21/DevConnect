const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Inicializa banco de dados (cria tabelas se não existirem)
require('./database');

const authRoutes    = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const profileRoutes = require('./routes/profile');

const app = express();

// ─── Middlewares ───────────────────────────────────────────────
app.use(cors({
  origin: /^http:\/\/localhost:\d+$/,  // aceita qualquer porta local (dev)
  credentials: true,
}));
app.use(express.json());

// ─── Rotas ────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/profile',  profileRoutes);

// ─── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Tratamento de erros global ───────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Erro interno:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// ─── Iniciar servidor ─────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 DevConnect API rodando em http://localhost:${PORT}`);
});
