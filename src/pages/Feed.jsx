import React, { useState, useEffect } from 'react';
import ProjectCard from '../components/ProjectCard';
import { projectsAPI } from '../services/api';
import { Link } from 'react-router-dom';
import './Feed.css';

export default function Feed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    projectsAPI.feed()
      .then(data => setProjects(data))
      .catch(err => console.error('Erro ao carregar feed:', err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.author_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.techs?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="feed-page container">
      <div className="feed-header">
        <div>
          <h1 className="page-title">Feed da Comunidade</h1>
          <p className="page-subtitle">Veja o que os devs estão construindo</p>
        </div>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            id="feed-search"
            type="text"
            className="search-input"
            placeholder="Buscar por projeto, dev ou tecnologia..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <span className="spinner" />
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🌐</div>
          <h3>O feed está vazio</h3>
          <p>Seja o primeiro a compartilhar um projeto!</p>
          <Link to="/register" className="btn btn-primary">Criar conta e publicar</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>Nenhum resultado para "{search}"</h3>
          <p>Tente buscar por outro nome ou tecnologia.</p>
        </div>
      ) : (
        <>
          <p className="feed-count">{filtered.length} projeto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
          <div className="feed-grid">
            {filtered.map(p => (
              <ProjectCard
                key={p.id}
                project={{ ...p, authorName: p.author_name }}
                showOwner
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
