import { useState, useEffect, useRef } from "react";

const jobs = [
  {
    company: "Bed Bath and Beyond",
    title: "Cloud Infrastructure Engineer",
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
    title: "Network Operations Center Engineer",
    date: "August 2018 – February 2021",
    bullets: [
      "Ensured platform reliability via real-time monitoring and troubleshooting of mission-critical systems using New Relic and the AWS console.",
      "Enhanced team responsiveness by leading communication through PagerDuty, improving issue resolution times.",
      "Developed and deployed custom automation tools using Python and BASH scripting to streamline routine system administration tasks.",
    ],
  },
  {
    company: "Bluehost",
    title: "Linux Systems Administrator",
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
  { label: "AWS Certified Cloud Practitioner", issued: "May 13, 2026", group: "active" },
  { label: "CompTIA A+", group: "active" },
  { label: "CompTIA Linux+", group: "active" },
  { label: "LPIC-1: Linux Administrator", group: "active" },
  { label: "AZ-900: Microsoft Azure Fundamentals", wip: true, group: "progress" },
  { label: "Kubernetes and Cloud Native Associate (KCNA)", wip: true, group: "progress" },
  { label: "AWS Certified SysOps Administrator – Associate", expired: true, group: "previous" },
  { label: "CompTIA Cloud+", expired: true, group: "previous" },
  { label: "CompTIA Security+", expired: true, group: "previous" },
];

const skillCategories = {
  Cloud: ["OpenStack", "Amazon Web Services", "Google Cloud Platform", "Infrastructure as a Service (IaaS)", "Ceph"],
  Containers: ["Kubernetes", "Docker"],
  "Automation & IaC": ["Ansible", "Terraform", "Bash", "Python", "PowerShell", "Packer"],
  Systems: ["Linux Administration", "System Administration", "Networking", "SSH", "Load Balancers"],
  Observability: ["Prometheus", "Grafana", "Alertmanager", "New Relic", "Root Cause Analysis"],
  Delivery: ["Jenkins", "GitHub Actions", "Git", "React", "Node.js"],
};

const allSkills = Object.entries(skillCategories).flatMap(([cat, skills]) =>
  skills.map((name) => ({ name, cat }))
);

const earlierExperience = [
  { title: "Remote Support Engineer", company: "iTok / Bask", date: "2010 – 2012" },
  { title: "Resolution Specialist", company: "Dell", date: "2007 – 2009" },
];

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
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`job-details-${i}`}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", padding: 0, border: 0, background: "transparent", color: "inherit", textAlign: "left", cursor: "pointer" }}
            >
              <span>
                <span style={{ display: "block", fontSize: "16px", fontWeight: 600 }}>{job.title}</span>
                <span style={{ display: "block", fontSize: "13px", color: "#6c757d", marginTop: "2px" }}>{job.company}</span>
              </span>
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
            </button>

            {/* expandable body */}
            <div
              id={`job-details-${i}`}
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
    <div className="container p-4 shadow-lg content-panel">

      <RevealSection delay={0}>
        <SectionTitle>Professional Summary</SectionTitle>
        <p style={{ color: "#495057", lineHeight: 1.75, margin: 0 }}>
          Cloud Infrastructure Engineer with 25+ years in IT and hands-on experience operating
          production OpenStack, Kubernetes, AWS, and GCP environments. Focused on Linux,
          infrastructure automation, observability, incident response, and highly available systems.
        </p>
      </RevealSection>

      <RevealSection delay={60}>
        <SectionTitle>Experience</SectionTitle>
        <Timeline />
      </RevealSection>

      <RevealSection delay={100}>
        <SectionTitle>Earlier Experience</SectionTitle>
        <div style={{ display: "grid", gap: "10px" }}>
          {earlierExperience.map(role => (
            <div key={`${role.company}-${role.date}`} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", paddingBottom: "10px", borderBottom: "1px solid #edf0f2" }}>
              <span><strong style={{ display: "block", fontSize: "14px" }}>{role.title}</strong><span style={{ color: "#6c757d", fontSize: "12px" }}>{role.company}</span></span>
              <span style={{ color: "#6c757d", fontSize: "12px", whiteSpace: "nowrap" }}>{role.date}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      <RevealSection delay={140}>
        <SectionTitle>Certifications</SectionTitle>
        {[{ key: "active", label: "Current" }, { key: "progress", label: "In progress" }, { key: "previous", label: "Previously held" }].map(group => (
          <div key={group.key} style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#6c757d", marginBottom: "7px" }}>{group.label}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {certs.filter(c => c.group === group.key).map(c => (
                <div key={c.label} style={{ fontSize: "12px", padding: "5px 12px", borderRadius: "6px", background: c.expired ? "#fff3cd" : "#f8f9fa", border: c.wip ? "1px dashed #adb5bd" : c.expired ? "1px solid #ffc107" : "1px solid #dee2e6", color: c.wip ? "#6c757d" : c.expired ? "#856404" : "#495057" }}>
                  {c.label}{c.issued ? ` · issued ${c.issued}` : ""}
                </div>
              ))}
            </div>
          </div>
        ))}
      </RevealSection>

      <RevealSection delay={180}>
        <SectionTitle>Technical Skills</SectionTitle>
        <Skills />
      </RevealSection>

    </div>
  );
};

export default Resume;
