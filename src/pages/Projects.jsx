import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import { projectsAPI } from '../services/api';
import './Projects.css';

function ProjectModal({ project, onSave, onClose }) {
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    github: project?.github || '',
    deploy: project?.deploy || '',
    techs: project?.techs || [],
  });
  const [techInput, setTechInput] = useState('');

  const addTech = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && techInput.trim()) {
      e.preventDefault();
      const t = techInput.trim().replace(/,$/, '');
      if (!form.techs.includes(t)) setForm(f => ({ ...f, techs: [...f.techs, t] }));
      setTechInput('');
    }
  };
  const removeTech = (t) => setForm(f => ({ ...f, techs: f.techs.filter(x => x !== t) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: project?.id });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{project?.id ? 'Editar Projeto' : 'Novo Projeto'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Título *</label>
            <input className="form-input" placeholder="Nome do projeto" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição *</label>
            <textarea className="form-input" placeholder="Descreva o projeto..." rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          </div>

          <div className="form-group">
            <label className="form-label">GitHub</label>
            <input className="form-input" placeholder="https://github.com/user/repo" value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="form-label">Deploy / Link</label>
            <input className="form-input" placeholder="https://meuprojeto.vercel.app" value={form.deploy} onChange={e => setForm(f => ({ ...f, deploy: e.target.value }))} />
          </div>

          <div className="form-group">
            <label className="form-label">Tecnologias (Enter para adicionar)</label>
            <input
              className="form-input"
              placeholder="React, Node.js, Python..."
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={addTech}
            />
            <div className="tags-container">
              {form.techs.map(t => (
                <span key={t} className="tag">
                  {t}
                  <button type="button" className="tag-remove" onClick={() => removeTech(t)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {project?.id ? 'Salvar alterações' : 'Criar projeto'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const data = await projectsAPI.mine();
      setProjects(data);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (formData) => {
    try {
      if (formData.id) {
        await projectsAPI.update(formData.id, formData);
      } else {
        await projectsAPI.create(formData);
      }
      await fetchProjects();
      setShowModal(false);
      setEditProject(null);
    } catch (err) {
      alert('Erro ao salvar projeto: ' + err.message);
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que quer deletar este projeto?')) return;
    try {
      await projectsAPI.delete(id);
      await fetchProjects();
    } catch (err) {
      alert('Erro ao deletar: ' + err.message);
    }
  };

  const openNew = () => {
    setEditProject(null);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="projects-page container" style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="projects-page container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Meus Projetos</h1>
          <p className="page-subtitle">Gerencie e compartilhe seus projetos</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          + Novo Projeto
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🚀</div>
          <h3>Nenhum projeto ainda</h3>
          <p>Clique em "Novo Projeto" para começar!</p>
          <button className="btn btn-primary" onClick={openNew}>Criar primeiro projeto</button>
        </div>
      ) : (
        <div className="projects-grid-page">
          {projects.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ProjectModal
          project={editProject}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProject(null); }}
        />
      )}
    </div>
  );
}
