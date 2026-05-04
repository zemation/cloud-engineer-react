# A Cloud Engineer

A personal portfolio and learning hub built in ReactJS — showcasing 25+ years of experience in cloud infrastructure, Linux administration, and front-end development.

Live site: [acloudengineer.com](https://acloudengineer.com)

---

## About

This site serves as a living portfolio for Robert Rodgers, a Systems and Cloud Infrastructure Engineer with experience across OpenStack, AWS, GCP, and Kubernetes. It also acts as a resource hub for IT certification and learning materials.

The project is self-hosted on a personal Kubernetes cluster, monitored via Prometheus and Grafana, and deployed through a Jenkins CI/CD pipeline.

---

## Pages

- **Home** — Introduction and specialty overview
- **Resume** — Work history, certifications, and skills with interactive filtering
- **Projects** — Technical home lab projects and infrastructure work
- **About** — Background, career timeline, and personal info

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | ReactJS, React Router, React Bootstrap |
| Styling | Bootstrap 5, inline CSS |
| Icons | Font Awesome |
| Hosting | Self-hosted Kubernetes cluster |
| Monitoring | Prometheus, Grafana, blackbox-exporter |
| CI/CD | Jenkins (webhook-triggered) |
| Storage | Longhorn (persistent volumes) |
| Networking | Cilium CNI |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/zemation/cloud-master
cd cloud-master
npm install
```

### Run locally

```bash
PORT=3001 npm start
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for production

```bash
npm run build
```

Output is in the `build/` folder, ready to serve.

---

## Infrastructure

This site runs on a self-hosted 3-node Kubernetes cluster:

- **Container orchestration** — Kubernetes via kubeadm
- **Networking** — Cilium CNI with kube-proxy replacement
- **Storage** — Longhorn with NFS/iSCSI backing
- **Monitoring** — Prometheus + Grafana stack via Helm
- **Deployments** — Jenkins pipelines triggered on PR merge

---

## Author

**Robert Rodgers**
- GitHub: [@zemation](https://github.com/zemation)
- LinkedIn: [robertbrodgers](https://www.linkedin.com/in/robertbrodgers)
- CodePen: [zemation](https://codepen.io/zemation)
- DEV: [zemation](https://dev.to/zemation)
- freeCodeCamp: [zemationx](https://www.freecodecamp.org/zemationx)

---

## License

MIT
