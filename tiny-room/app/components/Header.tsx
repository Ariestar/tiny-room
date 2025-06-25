import { NavLink } from 'react-router';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useState } from 'react';

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getActiveClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'nav-link active' : 'nav-link';

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    const root = document.documentElement;
    if (!isDarkMode) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  };

  return (
    <header className="site-header">
      <div className="container">
        <NavLink to="/" className="logo">
          Tiny&nbsp;Room
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" className={getActiveClass} end>
            首页
          </NavLink>
          <NavLink to="/projects" className={getActiveClass}>
            项目
          </NavLink>
          <NavLink to="/gallery" className={getActiveClass}>
            图库
          </NavLink>
          <NavLink to="/about" className={getActiveClass}>
            关于
          </NavLink>
          <NavLink to="/blog" className={getActiveClass}>
            博客
          </NavLink>
          <NavLink to="/contact" className={getActiveClass}>
            联系
          </NavLink>
        </nav>
        <button className="theme-toggle" aria-label="Toggle dark mode" onClick={toggleDarkMode}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
}
