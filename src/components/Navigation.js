import { useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/resume", label: "Resume" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/game", label: "Unity" },
];

const Navigation = () => {
  const { pathname } = useLocation();

  return (
    <>
      <style>{`
        .nav-dark {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          background: #1a1a2e;
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
        }

        .nav-link-custom {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          padding: 4px 14px;
          transition: color 0.2s;
        }

        .nav-link-custom::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 14px;
          right: 14px;
          height: 2px;
          background: #378ADD;
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.22s ease;
        }

        .nav-link-custom:hover {
          color: #fff;
        }

        .nav-link-custom:hover::after,
        .nav-link-custom.active::after {
          transform: scaleX(1);
        }

        .nav-link-custom.active {
          color: #fff;
        }
      `}</style>

      <nav className="nav-dark">
        <div style={{ display: "flex", gap: "4px" }}>
          {LINKS.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <LinkContainer to={to} key={to}>
                <Nav.Link className={`nav-link-custom${isActive ? " active" : ""}`}>
                  {label}
                </Nav.Link>
              </LinkContainer>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
