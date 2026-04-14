import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const features = [
  {
    icon: '🚀',
    title: 'Mostre seus Projetos',
    desc: 'Publique seus projetos com links do GitHub e deploy. Deixe o mundo ver o que você constrói.',
  },
  {
    icon: '🤝',
    title: 'Conecte-se com Devs',
    desc: 'Encontre outros desenvolvedores, veja seus projetos e inspire-se com o que a comunidade está criando.',
  },
  {
    icon: '⚡',
    title: 'Feed em Tempo Real',
    desc: 'Acompanhe os projetos mais recentes da comunidade. Curta e interaja com outros devs.',
  },
  {
    icon: '🎨',
    title: 'Perfil Personalizado',
    desc: 'Crie seu perfil com bio, habilidades e todos os seus projetos em um só lugar.',
  },
];

const stats = [
  { value: '100%', label: 'Open Source' },
  { value: 'Dark', label: 'Mode Only 🌙' },
  { value: '∞', label: 'Projetos' },
];

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge">🔥 Novo · DevConnect v1.0</span>
        </div>
        <h1 className="hero-title">
          A rede social dos<br />
          <span className="gradient-text">desenvolvedores</span>
        </h1>
        <p className="hero-subtitle">
          Compartilhe seus projetos, conecte-se com outros devs<br />
          e construa sua presença na comunidade tech.
        </p>
        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary btn-lg">
            🚀 Começar agora — é grátis
          </Link>
          <Link to="/feed" className="btn btn-outline btn-lg">
            Ver projetos
          </Link>
        </div>

        {/* Floating cards decoration */}
        <div className="hero-visual">
          <div className="floating-card card-1 glass animate-fade">
            <span className="badge">React</span>
            <p>Portfolio App</p>
            <small>❤️ 42 curtidas</small>
          </div>
          <div className="floating-card card-2 glass animate-fade">
            <span className="badge">Node.js</span>
            <p>API REST</p>
            <small>❤️ 31 curtidas</small>
          </div>
          <div className="floating-card card-3 glass animate-fade">
            <span className="badge">Python</span>
            <p>ML Dashboard</p>
            <small>❤️ 58 curtidas</small>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-value gradient-text">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tudo que você precisa</h2>
          <p className="section-subtitle">Uma plataforma completa para desenvolvedores mostrarem seu trabalho.</p>
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card glass">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box glass">
            <h2>Pronto para começar?</h2>
            <p>Crie sua conta grátis e comece a compartilhar seus projetos hoje.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Criar conta grátis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
