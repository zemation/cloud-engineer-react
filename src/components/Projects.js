import { useState, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";

// --- Data ---
const FEATURED = {
    title: "Kubernetes Cluster & Core Infrastructure",
    goal: "Establish a highly available, self-hosted Kubernetes cluster for development and production workloads.",
    tags: [{ label: "Infrastructure", color: "blue" }, { label: "Containers", color: "teal" }, { label: "Active", color: "green" }],
    bullets: [
        "Provisioned a 3-node Kubernetes cluster using both the \"Kubernetes the Hard Way\" methodology and automated deployment via kubeadm.",
        "Implemented Cilium as the CNI, configured for kube-proxy replacement to enhance networking performance and control.",
        "Deployed Longhorn for persistent volume management, leveraging dedicated storage configured with nfs-utils and iscsid.",
        "Demonstrated planning and recovery skills by re-imaging and re-partitioning systems to optimize disk space after XFS partition resizing limitations.",
    ],
};

const CARDS = [
    {
        title: "Monitoring & Observability Stack",
        goal: "Deploy a comprehensive monitoring solution to track cluster health, application performance, and external service availability.",
        tags: [{ label: "Observability", color: "purple" }, { label: "Active", color: "green" }],
        bullets: [
            "Deployed the full Prometheus and Grafana stack via Helm for centralized cluster monitoring, integrated with Longhorn.",
            "Configured blackbox-exporter to monitor availability of external websites and services.",
            "Planned integration to monitor ReactJS-based applications as they are deployed.",
        ],
    },
    {
        title: "CI/CD Pipeline",
        goal: "Implement an automated pipeline for rapid, reliable application deployment from source code to the production cluster.",
        tags: [{ label: "DevOps", color: "amber" }, { label: "In Progress", color: "warning" }],
        bullets: [
            "Initiated deployment of Jenkins on the Kubernetes cluster to manage application builds and deployments.",
            "Configuring webhooks and pipelines to automatically trigger deployments on pull request merges.",
        ],
    },
    {
        title: "Cloud-Master.io — Portfolio & Learning Hub",
        goal: "A public-facing web hub dedicated to compiling resources and training materials for IT certification and learning.",
        tags: [{ label: "Frontend", color: "teal" }, { label: "Active", color: "green" }],
        bullets: [
            "Built entirely in ReactJS, showcasing front-end development capabilities alongside infrastructure expertise.",
            "Acts as a live, evolving portfolio integrating Kubernetes hosting and Prometheus monitoring.",
        ],
        link: "https://Cloud-Master.io",
    },
    {
        title: "Local AI Integration (LM Studio)",
        goal: "Experiment with local AI models to enhance user support and troubleshooting on the Cloud-Master.io platform.",
        tags: [{ label: "AI / ML", color: "coral" }, { label: "Planned", color: "secondary" }],
        bullets: [
            "Experimenting with LM Studio and local AI/ML models to provide an interactive support bot.",
            "Bot will allow users to troubleshoot common issues by talking directly with a curated local AI model.",
        ],
    },
    {
        title: "AWS Certification Path",
        goal: "Progress from AWS Cloud Practitioner through to CloudOps Engineer certification.",
        tags: [{ label: "Cloud", color: "blue" }, { label: "In Progress", color: "warning" }],
        bullets: [
            "Currently studying for the AWS Cloud Practitioner certification.",
            "Path continues toward AWS CloudOps Engineer to complement existing infrastructure expertise.",
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
                    <Tag label="Featured" color="blue" />
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
                    {project.link && (
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
