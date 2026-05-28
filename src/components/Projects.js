import { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";

// --- Data ---
const FEATURED = {
    title: "Kubernetes Cluster & Core Infrastructure",
    goal: "Establish a self-hosted Kubernetes cluster for development and production workloads.",
    tags: [{ label: "Featured", color: "blue" }, { label: "Infrastructure", color: "blue" }, { label: "Containers", color: "teal" }, { label: "Active", color: "green" }],
    bullets: [
        "Provisioned a 3-node Kubernetes cluster (1 master, 2 workers) on Dell Optiplex nodes using kubeadm.",
        "Hosts use ext4 filesystems; cluster networking configured with standard CNI.",
        "Deployed Longhorn for persistent volume management with dedicated storage.",
        "Automated cluster provisioning and configuration via Ansible (ansible-kubernetes on GitHub).",
    ],
};

const CARDS = [
    {
        title: "Monitoring & Observability Stack",
        goal: "Deploy a comprehensive monitoring solution to track cluster health, node metrics, and external service availability.",
        tags: [{ label: "Observability", color: "purple" }, { label: "Active", color: "green" }],
        bullets: [
            "Running Prometheus, Grafana, and Alertmanager on a dedicated monitoring server.",
            "Dashboards configured for Kubernetes cluster health, Digital Ocean droplet, and system metrics (Node Exporter Full).",
            "Alertmanager integrated with Discord webhooks for real-time notifications.",
            "Blackbox exporter monitors external site availability.",
        ],
    },
    {
        title: "CI/CD Pipelines",
        goal: "Automated pipelines for building and deploying web applications on pull request merge.",
        tags: [{ label: "DevOps", color: "amber" }, { label: "Active", color: "green" }],
        bullets: [
            "Jenkins installed on a dedicated build server, managing all build and deploy pipelines.",
            "acloudengineer.com: React app — pipeline triggers on PR submit, builds and deploys to Digital Ocean droplet.",
            "cloud-master.io: separate Jenkinsfiles for the Vite/React frontend and Node.js backend.",
            "Pipelines deploy via CloudPanel on the production droplet.",
        ],
    },
    {
        title: "Websites (Live)",
        goal: "Public-facing sites serving content and API endpoints, hosted on a Digital Ocean droplet.",
        tags: [{ label: "Frontend", color: "teal" }, { label: "Active", color: "green" }],
        bullets: [
            "acloudengineer.com — built in React, deployed via Jenkins pipeline.",
            "cloud-master.io — frontend in Vite/React, backend Node.js + MongoDB at api.cloud-master.io.",
            "APM metrics for the Node backend wired into Grafana.",
            "Content actively being added to cloud-master.io.",
        ],
        link: "https://cloud-master.io",
    },
    {
        title: "Ansible Automation",
        goal: "Infrastructure-as-code for provisioning and configuring servers across multiple Linux distributions.",
        tags: [{ label: "Infrastructure", color: "blue" }, { label: "Active", color: "green" }],
        bullets: [
            "ansible-learnlinux: multi-distro automation with Vagrant, provisioning web, database, and file servers across Rocky Linux and Ubuntu.",
            "ansible-kubernetes: automated Kubernetes cluster deployment and configuration.",
            "Both repos public on GitHub (github.com/zemation), cleaned up and documented.",
            "Backlog: add HAProxy load balancer role to ansible-learnlinux.",
        ],
    },
    {
        title: "sysinfo — Go CLI Tool",
        goal: "A lightweight command-line tool for displaying system information, built as a Go learning project.",
        tags: [{ label: "Go", color: "teal" }, { label: "Active", color: "green" }],
        bullets: [
            "Reads directly from /proc and /sys — no external dependencies for data collection.",
            "Subcommand structure via Cobra: sysinfo, sysinfo processes cpu, sysinfo processes memory, sysinfo network.",
            "GitHub Actions workflows and releases configured.",
            "Published to GitHub (zemation/sysinfo) with full README and PDF guide.",
            "Planned: macOS and Windows support via Go build tags.",
        ],
    },
    {
        title: "Certification Path",
        goal: "Progress through cloud and Kubernetes certifications to complement hands-on infrastructure experience.",
        tags: [{ label: "Cloud", color: "blue" }, { label: "In Progress", color: "warning" }],
        bullets: [
            "AWS Cloud Practitioner — passed May 13, 2026.",
            "AZ-900 (Microsoft Azure Fundamentals) — in progress.",
            "Kubernetes and Cloud Native Associate (KCNA) — in progress.",
        ],
    },
    {
        title: "Terraform — Digital Ocean",
        goal: "Provision a DigitalOcean droplet using Terraform with cloud-init bootstrapping on first boot.",
        tags: [{ label: "Infrastructure", color: "blue" }, { label: "Terraform", color: "purple" }, { label: "WIP", color: "teal" }],
        bullets: [
            "Provisions a DigitalOcean droplet using the official Terraform provider.",
            "cloud-init bootstraps the server on first boot — installs sysinfo CLI tool automatically via GitHub releases.",
            "Variables-driven — image, size, region, and sysinfo version all configurable via terraform.tfvars.",
            "SSH key lookup references existing key registered in DigitalOcean account.",
            "Published to GitHub (zemation/terraform-digital-ocean).",
        ],
    },
    {
        title: "Terraform — AWS",
        goal: "Provision a full AWS environment using Terraform with remote state management.",
        tags: [{ label: "Infrastructure", color: "blue" }, { label: "Terraform", color: "purple" }, { label: "Cloud", color: "teal" }, { label: "WIP", color: "green" }],
        bullets: [
            "Provisions a complete AWS environment: VPC, public subnet, internet gateway, route tables, security groups, IAM role, and EC2 instance.",
            "AMI dynamically looked up — always pulls the latest Ubuntu 24.04 LTS from Canonical.",
            "Remote state stored in S3 with DynamoDB state locking.",
            "cloud-init bootstraps the EC2 instance on first boot — installs sysinfo CLI tool automatically.",
            "Published to GitHub (zemation/terraform-aws).",
        ],
    },
];

// --- Color maps ---
const TAG_COLORS = {
    blue: { bg: "#E6F1FB", border: "#85B7EB", text: "#0C447C" },
    teal: { bg: "#E1F5EE", border: "#5DCAA5", text: "#085041" },
    green: { bg: "#EAF3DE", border: "#97C459", text: "#27500A" },
    purple: { bg: "#EEEDFE", border: "#AFA9EC", text: "#3C3489" },
    amber: { bg: "#FAEEDA", border: "#EF9F27", text: "#633806" },
    coral: { bg: "#FAECE7", border: "#F0997B", text: "#712B13" },
    warning: { bg: "#fff3cd", border: "#ffc107", text: "#856404" },
    secondary: { bg: "#f1efe8", border: "#b4b2a9", text: "#444441" },
};

function Tag({ label, color }) {
    const c = TAG_COLORS[color] || TAG_COLORS.secondary;
    return (
        <span style={{
            fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
            background: c.bg, border: `0.5px solid ${c.border}`, color: c.text,
            fontWeight: 500, whiteSpace: "nowrap",
        }}>{label}</span>
    );
}

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
            transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
        }}>{children}</div>
    );
}

// --- Section title ---
function SectionTitle({ children }) {
    return (
        <div style={{
            fontSize: "11px", fontWeight: 500, letterSpacing: "0.09em",
            textTransform: "uppercase", color: "#6c757d",
            marginBottom: "1.1rem", paddingBottom: "6px",
            borderBottom: "1px solid #dee2e6",
        }}>{children}</div>
    );
}

// --- Featured project ---
function FeaturedProject({ project }) {
    return (
        <div style={{
            border: "2px solid #85B7EB",
            borderRadius: "12px",
            padding: "1.5rem",
            background: "#fff",
            marginBottom: "2rem",
        }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 500, margin: 0 }}>{project.title}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {project.tags.map(t => <Tag key={t.label} {...t} />)}
                </div>
            </div>
            <p style={{ fontSize: "13px", color: "#6c757d", marginBottom: "1rem", fontStyle: "italic" }}>
                Goal: {project.goal}
            </p>
            <ul style={{ paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "6px", margin: 0 }}>
                {project.bullets.map((b, i) => (
                    <li key={i} style={{ fontSize: "13px", color: "#495057", lineHeight: 1.6 }}>{b}</li>
                ))}
            </ul>
        </div>
    );
}

// --- Project card ---
function ProjectCard({ project, delay }) {
    const [open, setOpen] = useState(false);
    return (
        <Reveal delay={delay}>
            <div style={{
                border: "0.5px solid #dee2e6",
                borderRadius: "12px",
                padding: "1.25rem",
                background: "#fff",
                height: "100%",
                cursor: "pointer",
                transition: "border-color 0.2s",
            }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#85B7EB"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#dee2e6"}
                onClick={() => setOpen(o => !o)}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 500, margin: 0, color: "#212529" }}>{project.title}</h3>
                    <span style={{
                        fontSize: "10px", color: "#adb5bd", flexShrink: 0, paddingTop: "3px",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s",
                    }}>▼</span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }}>
                    {project.tags.map(t => <Tag key={t.label} {...t} />)}
                </div>

                <p style={{ fontSize: "13px", color: "#6c757d", margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>
                    {project.goal}
                </p>

                <div style={{
                    overflow: "hidden", maxHeight: open ? "400px" : "0px",
                    opacity: open ? 1 : 0, transition: "max-height 0.4s ease, opacity 0.3s ease",
                }}>
                    <ul style={{ paddingLeft: "1.1rem", marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px", marginBottom: 0 }}>
                        {project.bullets.map((b, i) => (
                            <li key={i} style={{ fontSize: "13px", color: "#495057", lineHeight: 1.6 }}>{b}</li>
                        ))}
                    </ul>
                    {project.notice && (
                        <div style={{
                            marginTop: "12px", padding: "6px 10px", borderRadius: "6px",
                            background: "#fff3cd", border: "0.5px solid #ffc107",
                            fontSize: "12px", color: "#856404",
                        }}>
                            {project.notice}
                        </div>
                    )}
                    {project.link && !project.notice && (
                        <a href={project.link} style={{ display: "inline-block", marginTop: "10px", fontSize: "13px", color: "#0d6efd" }}
                            onClick={e => e.stopPropagation()}>
                            {project.link} →
                        </a>
                    )}
                </div>
            </div>
        </Reveal>
    );
}

// --- Main ---
const Projects = () => {
    return (
        <Container className="p-4 shadow-lg w-50">

            <Reveal delay={0}>
                <SectionTitle>Technical Projects & Labs</SectionTitle>
                <FeaturedProject project={FEATURED} />
            </Reveal>

            <Reveal delay={80}>
                <SectionTitle>More Projects</SectionTitle>
            </Reveal>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
            }}>
                {CARDS.map((p, i) => (
                    <ProjectCard key={p.title} project={p} delay={100 + i * 60} />
                ))}
            </div>

        </Container>
    );
};

export default Projects;