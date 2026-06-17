import { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ParticleHero from "./ParticleHero";

// --- Scroll reveal ---
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.unobserve(el); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(22px)",
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>{children}</div>
  );
}

// --- Specialty blocks data ---
const SPECIALTIES = [
  {
    color: "blue",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "SysOps Admin",
    footer: "Operating Systems",
    stats: [
      { value: "25+", label: "Years experience" },
      { value: "Maintained", label: "System Integrity" },
    ],
    desc: "Certified Linux and Windows administrator. Proficient in PowerShell and BASH scripting for automation and system management.",
    tags: ["Linux", "Windows", "BASH", "PowerShell"],
  },
  {
    color: "teal",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
    title: "Cloud Engineer",
    footer: "Cloud Infrastructure",
    stats: [
      { value: "3", label: "Cloud platforms" },
      { value: "99.99%", label: "Availability driven" },
    ],
    desc: "Certified cloud professional focused on AWS, GCP, and OpenStack. Site reliability, IaaS/PaaS optimization, and hybrid cloud management.",
    tags: ["AWS", "GCP", "OpenStack", "Kubernetes"],
  },
  {
    color: "purple",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: "Web Developer",
    footer: "Front End Web",
    stats: [
      { value: "20+", label: "Years with HTML/CSS" },
      { value: "ReactJS", label: "Current stack" },
    ],
    desc: "Two decades of HTML and CSS experience, now building modern web applications with ReactJS, Bootstrap, and NodeJS.",
    tags: ["ReactJS", "NodeJS", "Bootstrap", "HTML/CSS"],
  },
];

const COLOR = {
  blue: { bg: "#E6F1FB", border: "#85B7EB", text: "#0C447C", tag: "#185FA5" },
  teal: { bg: "#E1F5EE", border: "#5DCAA5", text: "#085041", tag: "#0F6E56" },
  purple: { bg: "#EEEDFE", border: "#AFA9EC", text: "#3C3489", tag: "#534AB7" },
};

function SpecialtyCard({ s, delay }) {
  const c = COLOR[s.color];
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: "12px",
          border: `${hovered ? "2px" : "0.5px"} solid ${hovered ? c.border : "#dee2e6"}`,
          background: hovered ? c.bg : "#fff",
          padding: "1.5rem",
          transition: "border 0.2s, background 0.2s",
          height: "100%",
        }}
      >
        {/* icon + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "12px",
            background: c.bg, border: `0.5px solid ${c.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            {s.icon}
          </div>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 500, color: "#212529" }}>{s.title}</div>
            <div style={{ fontSize: "12px", color: "#6c757d" }}>{s.footer}</div>
          </div>
        </div>

        {/* stats */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "1rem" }}>
          {s.stats.map(st => (
            <div key={st.label} style={{
              flex: 1, background: "#f8f9fa", borderRadius: "8px",
              padding: "8px 10px", textAlign: "center",
            }}>
              <div style={{ fontSize: "16px", fontWeight: 500, color: c.text }}>{st.value}</div>
              <div style={{ fontSize: "11px", color: "#6c757d", lineHeight: 1.3 }}>{st.label}</div>
            </div>
          ))}
        </div>

        {/* desc */}
        <p style={{ fontSize: "13px", color: "#495057", lineHeight: 1.6, marginBottom: "1rem" }}>
          {s.desc}
        </p>

        {/* tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {s.tags.map(t => (
            <span key={t} style={{
              fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
              background: c.bg, border: `0.5px solid ${c.border}`, color: c.text, fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// --- Main ---
const Home = () => {
  return (
    <>
      {/* Hero — full-width, outside the container */}
      <ParticleHero />

      <Container className="mt-5">

        {/* Specialty cards */}
        <Row className="g-3 mb-5">
          {SPECIALTIES.map((s, i) => (
            <Col key={s.title} lg={4} md={6} sm={12}>
              <SpecialtyCard s={s} delay={100 + i * 80} />
            </Col>
          ))}
        </Row>

        {/* Info paragraph */}
        <Reveal delay={200}>
          <div style={{
            borderTop: "0.5px solid #dee2e6",
            paddingTop: "1.5rem",
            marginBottom: "2rem",
          }}>
            <p style={{ fontSize: "14px", color: "#6c757d", lineHeight: 1.8, margin: 0, textAlign: "center", maxWidth: "680px", marginLeft: "auto", marginRight: "auto" }}>
              With over 25 years of experience in the technical field — starting with a CompTIA A+ and
              spanning roles from local computer technician to Network Operations Center specialist to
              managing Kubernetes clusters on OpenStack, AWS, and GCP — bringing a wealth of expertise
              in hardware, Linux administration, cloud infrastructure, and front-end development.
            </p>
          </div>
        </Reveal>

      </Container>
    </>
  );
};

export default Home;