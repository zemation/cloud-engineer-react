import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Reveal from "./Reveal";

// --- Typewriter hook ---
const PHRASES = [
  "Cloud Infrastructure Engineer",
  "Linux & OpenStack Specialist",
  "Automation & Reliability Engineer",
];

function useTypewriter(phrases, typingSpeed = 65, deletingSpeed = 35, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    const safeIndex = phraseIndex % phrases.length;
    const current = phrases[safeIndex];

    if (!deleting && charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), typingSpeed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIndex === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex > 0) {
      const t = setTimeout(() => setCharIndex((c) => c - 1), deletingSpeed);
      return () => clearTimeout(t);
    }
    if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }
  }, [charIndex, deleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pause]);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    setDisplayed(phrases[phraseIndex % phrases.length].slice(0, charIndex));
  }, [charIndex, phraseIndex, phrases]);

  return displayed;
}

// --- Career timeline data ---
// type: "job" | "cert"
// status: undefined (active) | "expired" | "wip"
const milestones = [
  {
    year: "1999",
    type: "job",
    title: "Enrolled — Clearfield Job Corps Center",
    desc: "Pursued the computer trade formally after discovering a passion for tech through HTML in high school. Studied towards CompTIA A+ certification.",
  },
  {
    year: "2000",
    type: "cert",
    title: "CompTIA A+",
    desc: "Issued Jun 16, 2000. The certification that started it all.",
  },
  {
    year: "2007",
    type: "job",
    title: "Resolution Specialist — Dell",
    desc: "Mastered deep-dive hardware troubleshooting and enterprise customer service at Dell.",
  },
  {
    year: "2010",
    type: "job",
    title: "Remote Support Engineer — iTok/Bask",
    desc: "Provided high-level maintenance, software support, and malware remediation for diverse client systems.",
  },
  {
    year: "2012",
    type: "job",
    title: "Junior Sysadmin — Bluehost",
    desc: "Resolved complex issues across Linux, cPanel, shared, reseller, and VPS environments. Maintained 99.9%+ uptime.",
  },
  {
    year: "2018",
    type: "job",
    title: "NOC Engineer — Ancestry",
    desc: "Focused on website monitoring, outage coordination, and PagerDuty-led incident response for critical genealogy services.",
  },
  {
    year: "2019",
    type: "cert",
    title: "CompTIA Linux+ (powered by LPI)",
    desc: "Issued Aug 14, 2019.",
  },
  {
    year: "2019",
    type: "cert",
    title: "LPIC-1: Linux Administrator",
    desc: "Issued Aug 14, 2019.",
  },
  {
    year: "2019",
    type: "cert",
    title: "CompTIA Systems Support Specialist (CSSS) — Stackable",
    desc: "Issued Aug 14, 2019.",
  },
  {
    year: "2019",
    type: "cert",
    title: "CompTIA Cloud Essentials",
    desc: "Issued Dec 2, 2019.",
  },
  {
    year: "2019",
    type: "cert",
    title: "CIW Advanced HTML and CSS Specialist",
    desc: "Issued circa 2019 (exact date unknown). Certification Partners.",
  },
  {
    year: "2021",
    type: "job",
    title: "Cloud Infrastructure Engineer — Overstock / Bed Bath & Beyond",
    desc: "Managed hybrid cloud at scale (March 2021 – April 2026) — OpenStack, AWS, GCP, Kubernetes, Ceph, and Kolla Ansible.",
  },
  {
    year: "2021",
    type: "cert",
    title: "AWS Certified SysOps Administrator – Associate",
    status: "expired",
    desc: "Expired Jun 22, 2023.",
  },
  {
    year: "2021",
    type: "cert",
    title: "CompTIA Cloud+ ce",
    status: "expired",
    desc: "Expired Feb 19, 2023.",
  },
  {
    year: "2021",
    type: "cert",
    title: "CompTIA Security+ ce",
    status: "expired",
    desc: "Expired Jan 10, 2023.",
  },
  {
    year: "2021",
    type: "cert",
    title: "CompTIA Secure Cloud Professional (CSCP) — Stackable",
    status: "expired",
    desc: "Expired Jan 10, 2023.",
  },
  {
    year: "2026",
    type: "cert",
    title: "AWS Cloud Practitioner",
    desc: "Issued May 13, 2026.",
  },
  {
    year: "In Progress",
    type: "cert",
    title: "AZ-900 (Microsoft Azure Fundamentals)",
    status: "wip",
    desc: "Currently studying for AZ-900.",
  },
  {
    year: "In Progress",
    type: "cert",
    title: "Kubernetes and Cloud Native Associate (KCNA)",
    status: "wip",
    desc: "Currently studying for the KCNA.",
  },
];

// --- Timeline component ---
function dotStyle(m, isOpen) {
  if (m.status === "wip") return { bg: "#fff", border: "1.5px dashed #0d6efd" };
  if (m.status === "expired") return { bg: isOpen ? "#ffc107" : "#fff", border: isOpen ? "2.5px solid #ffc107" : "1.5px solid #ffc107" };
  if (m.type === "cert") return { bg: isOpen ? "#198754" : "#fff", border: isOpen ? "2.5px solid #198754" : "1.5px solid #198754" };
  return { bg: isOpen ? "#0d6efd" : "#fff", border: isOpen ? "2.5px solid #0d6efd" : "1.5px solid #adb5bd" };
}

function StatusBadge({ status, type }) {
  if (status === "expired") return (
    <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "10px", background: "#fff3cd", color: "#856404", border: "1px solid #ffc107", marginLeft: "6px", whiteSpace: "nowrap" }}>expired</span>
  );
  if (status === "wip") return (
    <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "10px", background: "#cfe2ff", color: "#084298", border: "1px dashed #86b7fe", marginLeft: "6px", whiteSpace: "nowrap" }}>in progress</span>
  );
  if (type === "cert") return (
    <span style={{ fontSize: "10px", padding: "1px 7px", borderRadius: "10px", background: "#d1e7dd", color: "#0a3622", border: "1px solid #a3cfbb", marginLeft: "6px", whiteSpace: "nowrap" }}>cert</span>
  );
  return null;
}

function CareerTimeline() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div style={{ position: "relative", paddingLeft: "32px", marginTop: "0.5rem" }}>
      <div style={{
        position: "absolute", left: "9px", top: "8px", bottom: "8px",
        width: "1.5px", background: "#dee2e6",
      }} />

      {milestones.map((m, i) => {
        const isOpen = openIndex === i;
        const ds = dotStyle(m, isOpen);
        return (
          <div
            key={i}
            style={{ position: "relative", marginBottom: i < milestones.length - 1 ? "1.4rem" : 0, cursor: "pointer" }}
          >
            {/* dot */}
            <div style={{
              position: "absolute", left: "-32px", top: "4px",
              width: "18px", height: "18px", borderRadius: "50%",
              background: ds.bg, border: ds.border,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, border-color 0.2s, transform 0.2s",
              transform: isOpen ? "scale(1.15)" : "scale(1)",
              zIndex: 1,
            }}>
              {isOpen && m.status !== "wip" && (
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />
              )}
            </div>

            {/* header */}
            <button type="button" aria-expanded={isOpen} aria-controls={`milestone-details-${i}`} onClick={() => setOpenIndex(isOpen ? null : i)} style={{ display: "flex", width: "100%", alignItems: "center", gap: "6px", flexWrap: "wrap", padding: 0, border: 0, background: "transparent", textAlign: "left", cursor: "pointer" }}>
              <span style={{
                fontSize: "11px", fontWeight: 500,
                color: m.status === "expired" ? "#ffc107" : m.type === "cert" ? "#198754" : isOpen ? "#0d6efd" : "#adb5bd",
                minWidth: "70px", flexShrink: 0, transition: "color 0.2s",
              }}>{m.year}</span>
              <span style={{ fontSize: "14px", fontWeight: isOpen ? 500 : 400, color: isOpen ? "#212529" : "#495057", transition: "color 0.2s" }}>
                {m.title}
              </span>
              <StatusBadge status={m.status} type={m.type} />
              <span style={{
                fontSize: "10px", color: "#adb5bd", marginLeft: "auto",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s", flexShrink: 0,
              }}>▼</span>
            </button>

            {/* expandable desc */}
            <div style={{
              overflow: "hidden",
              maxHeight: isOpen ? "200px" : "0px",
              opacity: isOpen ? 1 : 0,
              transition: "max-height 0.35s ease, opacity 0.3s ease",
              paddingLeft: "76px",
            }} id={`milestone-details-${i}`}>
              <p style={{ fontSize: "13px", color: "#6c757d", lineHeight: 1.55, marginTop: "6px", marginBottom: 0 }}>
                {m.desc}
              </p>
            </div>
          </div>
        );
      })}

      {/* legend */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginTop: "1.5rem", paddingLeft: "0" }}>
        {[
          { color: "#0d6efd", label: "Job" },
          { color: "#198754", label: "Cert" },
          { color: "#ffc107", label: "Expired" },
          { color: "#0d6efd", label: "In progress", dashed: true },
        ].map(({ color, label, dashed }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "10px", height: "10px", borderRadius: "50%",
              border: `1.5px ${dashed ? "dashed" : "solid"} ${color}`, background: "#fff",
            }} />
            <span style={{ fontSize: "11px", color: "#6c757d" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main About component ---
const About = () => {
  const text = useTypewriter(PHRASES);

  return (
    <Container className="p-4 mt-4 rounded-3 shadow-lg content-panel">
      <Row>
        <Col xs={12} md={3}>
          <div className="mb-3 mb-md-0">
            <img
              id="avatar"
              src="/images/avatar.jpg"
              alt="Headshot"
              className="img-fluid rounded-3 shadow-sm d-block mx-auto"
            />
          </div>
        </Col>

        <Col xs={12} md={9}>
          <Reveal delay={0}>
            {/* Typewriter headline */}
            <div style={{ marginBottom: "1.25rem" }}>
              <div style={{
                fontSize: "11px", fontWeight: 500, letterSpacing: "0.09em",
                textTransform: "uppercase", color: "#6c757d",
                marginBottom: "6px",
              }}>
                I am a
              </div>
              <div style={{ fontSize: "20px", fontWeight: 500, color: "#212529", minHeight: "32px", display: "flex", alignItems: "center", gap: "2px" }}>
                {text}
                <span style={{
                  display: "inline-block", width: "2px", height: "1.1em",
                  background: "#0d6efd", marginLeft: "2px",
                  animation: "blink 1s step-end infinite",
                }} />
              </div>
            </div>
            <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
          </Reveal>

          <Reveal delay={100}>
            <section>
              <h2 style={{ fontSize: "18px", fontWeight: 500, marginBottom: "0.75rem" }}>About Me</h2>
              <p style={{ fontSize: "14px", color: "#495057", lineHeight: 1.7 }}>
                My path into technology started with HTML in high school. In 1999 I enrolled at Clearfield
                Job Corps Center to pursue the computer trade, earning CompTIA A+ in 2000. That hands-on
                foundation has carried me from hardware and systems support to Linux operations, production
                monitoring, and large-scale hybrid-cloud infrastructure.
              </p>
              <p style={{ fontSize: "14px", color: "#495057", lineHeight: 1.7 }}>
                Across Dell, iTok/Bask, Bluehost, Ancestry, and Overstock/Bed Bath & Beyond, I have built a
                career around understanding how systems fail, making them easier to operate, and helping
                teams respond with clarity when reliability matters.
              </p>

              <h3 style={{ fontSize: "14px", fontWeight: 500, color: "#6c757d", marginBottom: "0.75rem", marginTop: "1.25rem" }}>Outside the Terminal</h3>
              <p style={{ fontSize: "14px", color: "#495057", lineHeight: 1.7 }}>
                Outside of work, I'm just as likely to be found troubleshooting my home lab as I am gaming.
                The home lab is where a lot of my real learning happens — it's where I get to break things
                on purpose, test new tech, and sharpen skills without a production environment on the line.
              </p>
              <p style={{ fontSize: "14px", color: "#495057", lineHeight: 1.7 }}>
                One thing that has always driven me, just as much as learning itself, is sharing what I know. It's what drives me to build cloud-master.io.
                Whether it's pointing someone toward the right resource, walking a colleague through a problem,
                or contributing to documentation — helping others along their path is something I genuinely care about.
              </p>
              <p style={{ fontSize: "14px", color: "#495057", lineHeight: 1.7 }}>
                I'm also a proud father of two young men who are nearly adults, which is somehow both
                impressive and terrifying at the same time. When I'm not in the lab, you'll find me gaming or watching
                whatever binge-worthy series I've convinced myself I'll finish that weekend.
              </p>
            </section>
          </Reveal>
        </Col>
      </Row>

      {/* Career Timeline — full width below */}
      <Row style={{ marginTop: "2rem" }}>
        <Col>
          <Reveal delay={150}>
            <div style={{
              fontSize: "11px", fontWeight: 500, letterSpacing: "0.09em",
              textTransform: "uppercase", color: "#6c757d",
              marginBottom: "1rem", paddingBottom: "6px",
              borderBottom: "1px solid #dee2e6",
            }}>
              Career Timeline
            </div>
            <CareerTimeline />
          </Reveal>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
