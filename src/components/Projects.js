import { Container } from "react-bootstrap";
import ProjectGallery from "./ProjectGallery";
import Reveal from "./Reveal";

// --- Data (ordered by display priority) ---
const CARDS = [
    {
        title: "Kubernetes Cluster & Core Infrastructure",
        goal: "Establish a self-hosted Kubernetes cluster for development and production workloads.",
        tags: [
            { label: "Kubernetes", color: "teal" },
            { label: "Active", color: "green" },
        ],
        bullets: [
            "Provisioned a 3-node Kubernetes cluster (1 master, 2 workers) on Dell Optiplex nodes using kubeadm.",
            "Hosts use ext4 filesystems; cluster networking configured with standard CNI.",
            "Nodes imaged via Cobbler/PXE boot, then configured via a dedicated Ansible playbook (see respective cards).",
            "Serves as the foundation for self-hosted workloads, including the monitoring stack and future application deployments.",
            "Hardware repurposed from decommissioned Dell Optiplex desktops — a cost-effective home lab build.",
        ],
        stats: [
            { label: "Nodes", value: "3" },
            { label: "Roles", value: "1 master · 2 workers" },
        ],
    },
    {
        title: "Terraform — Multi-Cloud Provisioning",
        goal: "Infrastructure-as-code modules provisioning compute environments across four cloud providers.",
        tags: [
            { label: "Terraform", color: "purple" },
            { label: "Infrastructure", color: "blue" },
            { label: "WIP", color: "amber" },
        ],
        bullets: [
            "DigitalOcean: provisions a droplet via the official provider, with cloud-init bootstrapping sysinfo on first boot.",
            "AWS: full environment — VPC, public subnet, IGW, route tables, security groups, IAM role, EC2 instance. Remote state in S3 with DynamoDB locking.",
            "Azure and GCP modules are scaffolded while provider-specific networking and compute resources are being implemented.",
            "Variables-driven across all four — image/SKU, size, and region configurable via .tfvars per provider.",
            "Each module published to its own GitHub repo (zemation/terraform-*) with cloud-init bootstrapping where supported.",
        ],
        stats: [
            { label: "Providers", value: "2 active · 2 WIP" },
            { label: "State backend", value: "S3 + DynamoDB" },
        ],
        githubUrl: "https://github.com/zemation/terraform-aws",
        secondaryGithubUrl: "https://github.com/zemation/terraform-digital-ocean",
    },
    {
        title: "Ansible Automation",
        goal: "Infrastructure-as-code for provisioning servers and Kubernetes clusters across multiple Linux distributions.",
        tags: [
            { label: "Ansible", color: "purple" },
            { label: "Infrastructure", color: "blue" },
            { label: "Active", color: "green" },
            { label: "WIP", color: "amber" },
        ],
        bullets: [
            "ansible-kubernetes: automates full Kubernetes cluster provisioning — kubeadm init/join, CNI setup, and node configuration.",
            "ansible-learnlinux: multi-distro automation with Vagrant, provisioning web, database, and file servers across Rocky Linux and Ubuntu.",
            "Idempotent playbooks — safe to re-run against existing infrastructure without unintended side effects.",
            "Both repos public on GitHub (github.com/zemation), cleaned up and documented with READMEs.",
            "Backlog: add HAProxy load balancer role to ansible-learnlinux.",
        ],
        stats: [
            { label: "Repos", value: "2" },
            { label: "Distros", value: "Rocky · Ubuntu" },
        ],
        githubUrl: "https://github.com/zemation/ansible-learnlinux",
        secondaryGithubUrl: "https://github.com/zemation/ansible-kubernetes",
    },
    {
        title: "Monitoring & Observability Stack",
        goal: "Deploy a comprehensive monitoring solution to track cluster health, node metrics, and external service availability.",
        tags: [
            { label: "Prometheus", color: "amber" },
            { label: "Grafana", color: "amber" },
            { label: "Active", color: "green" },
        ],
        bullets: [
            "Running Prometheus, Grafana, and Alertmanager on a dedicated monitoring server.",
            "Dashboards configured for Kubernetes cluster health, Digital Ocean droplet, and system metrics (Node Exporter Full).",
            "Alertmanager integrated with Discord webhooks for real-time notifications.",
            "Blackbox exporter monitors external site availability.",
        ],
        stats: [
            { label: "Alerts via", value: "Discord" },
            { label: "Exporters", value: "3" },
        ],
    },
    {
        title: "CI/CD Pipelines",
        goal: "Automated pipelines for building and deploying web applications on merge to main.",
        tags: [
            { label: "GitHub Actions", color: "purple" },
            { label: "Jenkins", color: "amber" },
            { label: "Active", color: "green" },
        ],
        bullets: [
            "Automated build and deployment workflows across GitHub Actions and Jenkins.",
            "acloudengineer.com: React app — GitHub Actions workflow builds and deploys via rsync over SSH to DigitalOcean on merge to main.",
            "cloud-master.io: automated pipelines for the Vite/React frontend and Node.js backend.",
            "Pipelines deploy to production sites managed via CloudPanel on the production droplet.",
        ],
        stats: [
            { label: "Trigger", value: "Merge to main" },
            { label: "Pipelines", value: "3" },
        ],
    },
    {
        title: "Cobbler — PXE Boot Imaging",
        goal: "Automated bare-metal OS provisioning for the home lab via network boot, eliminating manual installs.",
        tags: [
            { label: "Cobbler", color: "coral" },
            { label: "PXE", color: "blue" },
            { label: "Active", color: "green" },
        ],
        bullets: [
            "Cobbler server configured to PXE-boot bare-metal nodes over the network — no USB installer required.",
            "Automatically images the Dell Optiplex nodes that make up the Kubernetes cluster.",
            "Kickstart/preseed profiles define the OS install non-interactively, ensuring every node starts from an identical baseline.",
            "A node can be wiped and re-imaged from scratch in the time it takes to reboot and PXE-boot — useful when testing cluster rebuilds.",
            "Sits underneath Ansible in the stack: Cobbler images the bare metal, then Ansible takes over for configuration and kubeadm setup.",
        ],
        stats: [
            { label: "Boot method", value: "PXE" },
            { label: "Nodes imaged", value: "3" },
        ],
    },
    {
        title: "sysinfo — Go CLI Tool",
        goal: "A lightweight command-line tool for displaying system information, built as a Go learning project.",
        tags: [
            { label: "Go", color: "teal" },
            { label: "GitHub Actions", color: "purple" },
            { label: "Active", color: "green" },
            { label: "WIP", color: "amber" },
        ],
        bullets: [
            "Reads directly from /proc and /sys for data collection — no external libraries needed for that part.",
            "Subcommand structure via Cobra: sysinfo, sysinfo processes cpu, sysinfo processes memory, sysinfo network.",
            "GitHub Actions workflows and releases configured.",
            "Published to GitHub (zemation/sysinfo) with full README and PDF guide.",
            "Planned: macOS and Windows support via Go build tags.",
        ],
        stats: [
            { label: "Language", value: "Go" },
            { label: "Subcommands", value: "4" },
        ],
        githubUrl: "https://github.com/zemation/sysinfo",
    },
    {
        title: "Websites (Live)",
        goal: "Public-facing sites serving content and API endpoints, hosted on a Digital Ocean droplet.",
        tags: [
            { label: "React", color: "teal" },
            { label: "Node", color: "green" },
            { label: "Active", color: "green" },
        ],
        bullets: [
            "acloudengineer.com — built in React, deployed automatically via GitHub Actions.",
            "cloud-master.io — frontend in Vite/React, backend Node.js + MongoDB at api.cloud-master.io.",
            "APM metrics for the Node backend wired into Grafana.",
            "Content actively being added to cloud-master.io.",
        ],
        stats: [
            { label: "Sites live", value: "2" },
            { label: "Backend", value: "Node + Mongo" },
        ],
        link: "https://cloud-master.io",
        secondaryLink: "https://www.acloudengineer.com",
    },
];

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

// --- Project links — a simple, reliable list below the 3D gallery.
// Clicking inside a rotating 3D scene is fragile (easy to misclick mid-drag,
// no visual cue on the card itself, silently does nothing for projects
// without a link) so actual navigation lives here instead. ---
function ProjectLinks({ projects }) {
    return (
        <section aria-labelledby="project-details-title" style={{ marginTop: "2rem" }}>
        <h2 id="project-details-title" style={{ fontSize: "20px", marginBottom: "6px" }}>Project case studies</h2>
        <p style={{ color: "#6c757d", fontSize: "13px", lineHeight: 1.6, marginBottom: "1rem" }}>
            Each project connects an operational problem to a working implementation. Repositories and live systems are linked where public.
        </p>
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
            marginTop: "1.5rem",
        }}>
            {projects.map(p => (
                <div
                    key={p.title}
                    style={{
                        border: "0.5px solid #dee2e6",
                        borderRadius: "10px",
                        padding: "16px",
                        background: "#fff",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#212529" }}>
                        {p.title}
                    </div>
                    <span style={{ fontSize: "10px", borderRadius: "999px", padding: "2px 7px", whiteSpace: "nowrap", color: p.tags.some(t => t.label === "WIP") ? "#856404" : "#0a3622", background: p.tags.some(t => t.label === "WIP") ? "#fff3cd" : "#d1e7dd" }}>
                        {p.tags.some(t => t.label === "WIP") ? "In progress" : "Active"}
                    </span>
                    </div>
                    <p style={{ fontSize: "12px", lineHeight: 1.55, color: "#6c757d", marginBottom: "10px" }}>{p.goal}</p>
                    <div style={{ display: "flex", gap: "12px", marginBottom: "10px", padding: "8px", borderRadius: "7px", background: "#f8f9fa" }}>
                        {p.stats?.map(stat => <span key={stat.label} style={{ fontSize: "11px", color: "#495057" }}><strong style={{ display: "block" }}>{stat.value}</strong>{stat.label}</span>)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                        {!p.link && !p.secondaryLink && !p.githubUrl && !p.secondaryGithubUrl && (
                            <span style={{ fontSize: "11px", color: "#868e96" }}>Implementation details shown in the gallery.</span>
                        )}
                        {p.link && (
                            <a
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: "12px", color: "#0d6efd", textDecoration: "none" }}
                            >
                                {p.link.replace("https://", "")} →
                            </a>
                        )}
                        {p.secondaryLink && (
                            <a
                                href={p.secondaryLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: "12px", color: "#0d6efd", textDecoration: "none" }}
                            >
                                {p.secondaryLink.replace("https://", "")} →
                            </a>
                        )}
                        {p.githubUrl && (
                            <a
                                href={p.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: "12px", color: "#0d6efd", textDecoration: "none" }}
                            >
                                {p.githubUrl.replace("https://github.com/", "github.com/")} →
                            </a>
                        )}
                        {p.secondaryGithubUrl && (
                            <a
                                href={p.secondaryGithubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ fontSize: "12px", color: "#0d6efd", textDecoration: "none" }}
                            >
                                {p.secondaryGithubUrl.replace("https://github.com/", "github.com/")} →
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
        </section>
    );
}

// --- Main ---
const Projects = () => {
    return (
        <Container className="p-4 mt-4 rounded-3 shadow-lg content-panel">

            <Reveal delay={0}>
                <SectionTitle>Technical Projects & Labs</SectionTitle>
                <div style={{ maxWidth: "680px", marginBottom: "1.25rem" }}>
                    <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", marginBottom: "10px" }}>Infrastructure built to be operated</h1>
                    <p style={{ color: "#6c757d", lineHeight: 1.7, margin: 0 }}>
                        Hands-on work spanning bare-metal provisioning, Kubernetes, infrastructure as code,
                        observability, and automated delivery. Explore the 3D overview, then review the implementation evidence below.
                    </p>
                </div>
                <ProjectGallery projects={CARDS} />
                <ProjectLinks projects={CARDS} />
            </Reveal>

        </Container>
    );
};

export default Projects;
