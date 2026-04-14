import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import { profileAPI, projectsAPI } from '../services/api';
import './Profile.css';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    skills: user?.skills || [],
  });
  const [skillInput, setSkillInput] = useState('');

  // Carrega projetos do usuário
  useEffect(() => {
    projectsAPI.mine()
      .then(data => setProjects(data))
      .catch(err => console.error('Erro ao carregar projetos:', err.message))
      .finally(() => setLoadingProjects(false));
  }, []);

  // Atualiza form quando user muda (após salvar)
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        skills: user.skills || [],
      });
    }
  }, [user]);

  const addSkill = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const s = skillInput.trim().replace(/,$/, '');
      if (!form.skills.includes(s)) {
        setForm(f => ({ ...f, skills: [...f.skills, s] }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const result = await updateProfile(form);
    setSaving(false);
    if (result.success) {
      setEditing(false);
    } else {
      setError(result.error || 'Erro ao salvar.');
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <div className="profile-page container">
      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar glass">
          <div className="avatar avatar-lg">{initials}</div>

          {editing ? (
            <div className="edit-form">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-input" rows={3} placeholder="Fale sobre você..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">GitHub</label>
                <input className="form-input" placeholder="https://github.com/user" value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn</label>
                <input className="form-input" placeholder="https://linkedin.com/in/user" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Skills (Enter para adicionar)</label>
                <input
                  className="form-input"
                  placeholder="React, Node.js, Python..."
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={addSkill}
                />
                <div className="tags-container">
                  {form.skills.map(s => (
                    <span key={s} className="tag">
                      {s}
                      <button className="tag-remove" onClick={() => removeSkill(s)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              {error && <p style={{ color: 'var(--error)', fontSize: 14 }}>{error}</p>}
              <div className="edit-actions">
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="spinner" /> : 'Salvar'}
                </button>
                <button className="btn btn-ghost" onClick={() => { setEditing(false); setError(''); }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-info">
                <h2 className="profile-name">{user?.name}</h2>
                <p className="profile-email">{user?.email}</p>
                {user?.bio && <p className="profile-bio">{user.bio}</p>}
              </div>

              {(user?.github || user?.linkedin) && (
                <div className="profile-links">
                  {user.github && (
                    <a href={user.github} target="_blank" rel="noopener noreferrer" className="profile-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                      GitHub
                    </a>
                  )}
                  {user.linkedin && (
                    <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              )}

              {user?.skills?.length > 0 && (
                <div className="profile-skills">
                  <h4>Skills</h4>
                  <div className="tags-container">
                    {user.skills.map(s => <span key={s} className="tag">{s}</span>)}
                  </div>
                </div>
              )}

              <button className="btn btn-outline" onClick={() => setEditing(true)} style={{ width: '100%', justifyContent: 'center' }}>
                ✏️ Editar perfil
              </button>
            </>
          )}
        </aside>

        {/* Main content */}
        <main className="profile-main">
          <div className="profile-main-header">
            <h2>Meus Projetos</h2>
            <span className="badge">{projects.length} projeto{projects.length !== 1 ? 's' : ''}</span>
          </div>

          {loadingProjects ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
              <span className="spinner" />
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <div className="icon">💻</div>
              <h3>Nenhum projeto ainda</h3>
              <p>Vá para a aba Projetos e crie seu primeiro projeto!</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
