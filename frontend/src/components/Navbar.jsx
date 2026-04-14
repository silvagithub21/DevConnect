import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? "#0f172a" : "#f1f5f9";
    document.body.style.color = darkMode ? "#fff" : "#000";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <nav style={darkMode ? styles.darkNav : styles.lightNav}>
      <h2 style={styles.logo}>DevConnect</h2>

      <ul style={styles.menu}>
        <li><Link to="/" style={styles.link}>Home</Link></li>
        <li><Link to="/about" style={styles.link}>Sobre</Link></li>
        <li><Link to="/projects" style={styles.link}>Projetos</Link></li>
        <li><Link to="/contact" style={styles.link}>Contato</Link></li>
      </ul>

      <button onClick={() => setDarkMode(!darkMode)} style={styles.button}>
        {darkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}

const styles = {
  darkNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#0f172a",
  },
  lightNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#e2e8f0",
  },
  logo: {
    color: "#38bdf8",
  },
  menu: {
    display: "flex",
    gap: "20px",
    listStyle: "none",
  },
  link: {
    textDecoration: "none",
    fontWeight: "bold",
    color: "inherit",
  },
  button: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Navbar;