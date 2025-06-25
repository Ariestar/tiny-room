import { NavLink } from "react-router";

export default function Header() {
  const getActiveClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="site-header">
      <div className="container">
        <NavLink to="/" className="logo">
          My&nbsp;Portfolio
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" className={getActiveClass} end>
            Home
          </NavLink>
          <NavLink to="/projects" className={getActiveClass}>
            Projects
          </NavLink>
          <NavLink to="/gallery" className={getActiveClass}>
            Gallery
          </NavLink>
        </nav>
        {/* Dark mode toggle placeholder */}
        <button className="theme-toggle" aria-label="Toggle dark mode">
          🌓
        </button>
      </div>
    </header>
  );
} 