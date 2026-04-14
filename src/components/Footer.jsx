import React from 'react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <span className="footer-logo">&lt;/&gt; DevConnect</span>
        <p className="footer-copy">
          © {year} <strong>Kleberson Silva</strong>. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
