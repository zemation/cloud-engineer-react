import { useState, useEffect, useRef } from "react";

const jobs = [
  {
    company: "Bed Bath and Beyond",
    date: "March 2021 – Present",
    bullets: [
      "Drove 99.99%+ system availability by managing critical cloud infrastructure, including OpenStack cluster networking and storage across compute, networking, and database tiers.",
      "Led cloud infrastructure optimization, implementing IaaS/PaaS solutions to enhance capabilities and reduce operational costs.",
      "Managed AWS/GCP public cloud access, reducing spend by identifying unused accounts and provisioning role-based permissions.",
      "Architected and deployed production OpenStack environments using Kolla Ansible and Ceph Storage, culminating in Openstack Caracal via Kolla-Ansible and Ceph Reef.",
    ],
  },
  {
    company: "Ancestry",
    date: "August 2018 – February 2021",
    bullets: [
      "Ensured platform reliability via real-time monitoring and troubleshooting of mission-critical systems using New Relic and the AWS console.",
      "Enhanced team responsiveness by leading communication through PagerDuty, improving issue resolution times.",
      "Developed and deployed custom automation tools using Python and BASH scripting to streamline routine system administration tasks.",
    ],
  },
  {
    company: "Bluehost",
    date: "October 2012 – October 2017",
    bullets: [
      "Optimized complex load and performance bottlenecks across Shared, Cloud, Reseller, and VPS hosting environments, maintaining 99.9%+ uptime.",
      "Resolved critical performance bottlenecks on CentOS 6 servers using sar, vmstat, strace, and netstat.",
      "Drove efficient resolution of production issues by coordinating internal/external groups and serving as technical liaison for RCA with engineering teams.",
      "Maintained system security and compliance by managing access controls, mitigating threats, and addressing abusive accounts.",
    ],
  },
];

const certs = [
  { label: "CompTIA A+", wip: false },
  { label: "CompTIA Linux+", wip: false },
  { label: "CompTIA Cloud+", wip: false },
  { label: "CompTIA Security+", wip: false },
  { label: "LPIC-1: Linux Administrator", wip: false },
  { label: "AWS SysOps Administrator", expired: true },
  { label: "Certified Kubernetes Administrator", wip: true },
  { label: "AWS Cloud Practitioner", issued: "May 13, 2026" },
];

const skillCategories = {
  Cloud: ["Cloud Computing", "Amazon Web Services", "Google Cloud Platform", "Openstack", "Infrastructure as a Service (IaaS)", "Cloud Panel"],
  "Linux & OS": ["Linux Administration", "Linux", "Microsoft Windows", "System Administration"],
  Containers: ["Containerization", "Kubernetes", "Docker"],
  "Dev & Code": ["BASH", "Python", "PowerShell", "NodeJS", "Django", "Git", "Packer", "API", "Bootstrap", "Front-End Development"],
  Ops: ["Troubleshooting", "Root Cause Analysis", "Problem Analysis", "Technical Support", "New Relic", "SSH", "Load Balancers", "Technical Documentation", "CPanel"],
  "Soft Skills": ["Communication", "Problem Solving", "Analytical Skills"],
};

const allSkills = Object.entries(skillCategories).flatMap(([cat, skills]) =>
  skills.map((name) => ({ name, cat }))
);

// --- Scroll reveal hook ---
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// --- Section wrapper with fade-slide animation ---
function RevealSection({ children, delay = 0 }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        marginBottom: "2.5rem",
      }}
    >
      {children}
    </div>
  );
}

// --- Timeline ---
function Timeline() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={{ position: "relative", paddingLeft: "28px" }}>
      {/* vertical line */}
      <div
        style={{
          position: "absolute",
          left: "7px",
          top: "6px",
          bottom: "6px",
          width: "1.5px",
          background: "var(--bs-border-color, #dee2e6)",
        }}
      />
      {jobs.map((job, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={job.company}
            onClick={() => setOpenIndex(isOpen ? -1 : i)}
            style={{
              position: "relative",
              marginBottom: i < jobs.length - 1 ? "2rem" : 0,
              cursor: "pointer",
            }}
          >
            {/* dot */}
            <div
              style={{
                position: "absolute",
                left: "-28px",
                top: "5px",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                background: "var(--bs-body-bg, #fff)",
                border: isOpen ? "2.5px solid #0d6efd" : "1.5px solid #adb5bd",
                transform: isOpen ? "scale(1.2)" : "scale(1)",
                transition: "border-color 0.2s, transform 0.2s",
                zIndex: 1,
              }}
            />

            {/* header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
              <span style={{ fontSize: "16px", fontWeight: 500 }}>{job.company}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <span style={{ fontSize: "12px", color: "#6c757d", paddingTop: "2px" }}>{job.date}</span>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6c757d",
                    display: "inline-block",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    paddingTop: "3px",
                  }}
                >
                  ▼
                </span>
              </span>
            </div>

            {/* expandable body */}
            <div
              style={{
                overflow: "hidden",
                maxHeight: isOpen ? "600px" : "0px",
                opacity: isOpen ? 1 : 0,
                transition: "max-height 0.4s ease, opacity 0.3s ease",
              }}
            >
              <ul style={{ marginTop: "10px", paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "6px" }}>
                {job.bullets.map((b, j) => (
                  <li key={j} style={{ fontSize: "13px", color: "#6c757d", lineHeight: 1.55 }}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Skill filters ---
function Skills() {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <>
      {/* filter buttons */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
        {[null, ...Object.keys(skillCategories)].map((cat) => {
          const label = cat ?? "All";
          const isActive = activeFilter === cat;
          return (
            <button
              key={label}
              onClick={() => setActiveFilter(cat)}
              style={{
                fontSize: "12px",
                padding: "4px 12px",
                borderRadius: "20px",
                border: isActive ? "1px solid #86b7fe" : "1px solid #dee2e6",
                background: isActive ? "#cfe2ff" : "transparent",
                color: isActive ? "#084298" : "#6c757d",
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s, border-color 0.15s",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* skill tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {allSkills.map((skill) => {
          const isMatch = !activeFilter || skill.cat === activeFilter;
          return (
            <div
              key={skill.name}
              style={{
                fontSize: "12px",
                padding: "4px 10px",
                borderRadius: "20px",
                border: isMatch && activeFilter ? "1px solid #86b7fe" : "1px solid #dee2e6",
                background: isMatch && activeFilter ? "#cfe2ff" : "#f8f9fa",
                color: isMatch && activeFilter ? "#084298" : "#6c757d",
                opacity: isMatch ? 1 : 0,
                transform: isMatch ? "scale(1)" : "scale(0.85)",
                pointerEvents: isMatch ? "auto" : "none",
                transition: "opacity 0.2s, transform 0.2s, background 0.15s, color 0.15s, border-color 0.15s",
              }}
            >
              {skill.name}
            </div>
          );
        })}
      </div>
    </>
  );
}

// --- Section heading ---
function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: "#6c757d",
        marginBottom: "1.1rem",
        paddingBottom: "6px",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      {children}
    </div>
  );
}

// --- Main component ---
const Resume = () => {
  return (
    <div className="container p-4 shadow-lg w-50">

      <RevealSection delay={0}>
        <SectionTitle>Experience</SectionTitle>
        <Timeline />
      </RevealSection>

      <RevealSection delay={80}>
        <SectionTitle>Certifications</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {certs.map((c) => (
            <div
              key={c.label}
              style={{
                fontSize: "12px",
                padding: "5px 12px",
                borderRadius: "6px",
                background: c.expired ? "#fff3cd" : "#f8f9fa",
                border: c.wip ? "1px dashed #adb5bd" : c.expired ? "1px solid #ffc107" : "1px solid #dee2e6",
                color: c.wip ? "#adb5bd" : c.expired ? "#856404" : "#6c757d",
                fontStyle: c.wip ? "italic" : "normal",
              }}
            >
              {c.wip ? `${c.label} (in progress)` : c.expired ? `${c.label} (expired)` : c.label}
            </div>
          ))}
        </div>
      </RevealSection>

      <RevealSection delay={160}>
        <SectionTitle>Skills</SectionTitle>
        <Skills />
      </RevealSection>

    </div>
  );
};

export default Resume;
