import { Container, Row } from 'react-bootstrap';

const LINKS = [
  { href: "http://www.github.com/zemation", icon: "fa-brands fa-github", label: "GitHub" },
  { href: "https://www.linkedin.com/in/robertbrodgers", icon: "fa-brands fa-linkedin", label: "LinkedIn" },
  { href: "https://codepen.io/zemation", icon: "fa-brands fa-codepen", label: "CodePen" },
  { href: "https://www.freecodecamp.org/zemationx", icon: "fa-brands fa-free-code-camp", label: "freeCodeCamp" },
  { href: "https://dev.to/zemation", icon: "fa-brands fa-dev", label: "DEV" },
];

const Footer = () => {
  return (
    <Container fluid className="mt-5" style={{
      background: "#1a1a2e",
      borderTop: "0.5px solid rgba(255,255,255,0.08)",
      paddingTop: "1.5rem",
      paddingBottom: "1.5rem",
    }}>

      <Row className="justify-content-center" style={{ marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
          {LINKS.map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              title={label}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "40px", height: "40px", borderRadius: "8px",
                border: "0.5px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.55)",
                fontSize: "18px", textDecoration: "none",
                transition: "border-color 0.2s, color 0.2s, background 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#378ADD";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(55,138,221,0.15)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <i className={icon}></i>
            </a>
          ))}
        </div>
      </Row>

      <Row>
        <p style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
          &copy; 2026 acloudengineer.com
        </p>
      </Row>

    </Container>
  );
};

export default Footer;
