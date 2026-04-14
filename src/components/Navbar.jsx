import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">&lt;/&gt;</span>
          <span className="logo-text">DevConnect</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/feed" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Feed</NavLink>
          {user && (
            <>
              <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Projetos</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Perfil</NavLink>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <div className="avatar" title={user.name}>{initials}</div>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sair</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Entrar</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Cadastrar</Link>
            </>
          )}
        </div>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
