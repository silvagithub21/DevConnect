import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';
import './ProjectCard.css';

export default function ProjectCard({ project, onEdit, onDelete, showOwner = false }) {
  const { user } = useAuth();
  
  // Sincroniza com os dados reais vindos da API
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(project.like_count || 0);
  const [loadingLike, setLoadingLike] = useState(false);

  // No banco, p.author_name vem do JOIN no feed, mas no /mine vem como author_id
  const authorName = project.author_name || (project.author_id === user?.id ? user?.name : 'Dev');

  const handleLike = async () => {
    if (!user) return alert('Faça login para curtir!');
    if (loadingLike) return;

    setLoadingLike(true);
    try {
      const data = await projectsAPI.like(project.id);
      setLiked(data.liked);
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
    } catch (err) {
      console.error('Erro ao curtir:', err.message);
    } finally {
      setLoadingLike(false);
    }
  };

  const initials = authorName
    ? authorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="project-card glass">
      <div className="card-header">
        <div className="card-title-row">
          <h3 className="card-title">{project.title}</h3>
          <div className="card-links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link" title="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
            )}
            {project.deploy && (
              <a href={project.deploy} target="_blank" rel="noopener noreferrer" className="card-link" title="Deploy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {showOwner && (
          <div className="card-owner">
            <div className="avatar" style={{ width: 24, height: 24, fontSize: 10 }}>{initials}</div>
            <span>{authorName}</span>
          </div>
        )}
      </div>

      <p className="card-description">{project.description}</p>

      {project.techs?.length > 0 && (
        <div className="tags-container">
          {project.techs.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      <div className="card-footer">
        <button
          className={`like-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loadingLike}
          aria-label="Curtir"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{likeCount}</span>
        </button>

        {(onEdit || onDelete) && (
          <div className="card-actions">
            {onEdit && <button className="btn btn-ghost btn-sm" onClick={() => onEdit(project)}>Editar</button>}
            {onDelete && <button className="btn btn-danger btn-sm" onClick={() => onDelete(project.id)}>Deletar</button>}
          </div>
        )}
      </div>
    </div>
  );
}
