import { Container } from 'react-bootstrap'


const Projects = () => {
  return (

      <Container className="p-4 shadow-lg w-50">
      <section>
        <h2>Technical Projects &amp; Labs</h2>
        
        {/* Kubernetes Cluster */}
        <div>
            <h3>Kubernetes Cluster &amp; Core Infrastructure 💻</h3>
            <p>
                **Project Goal:** Establish a highly available, self-hosted Kubernetes cluster for development and production workloads.
            </p>
            <ul>
                <li>Successfully provisioned a 3-node Kubernetes cluster, gaining experience with both **"Kubernetes the Hard Way"** methodology and automated deployment via **kubeadm**.</li>
                <li>Implemented **Cilium** as the CNI, configured for **kube-proxy replacement** to enhance networking performance and control, managing component dependencies effectively.</li>
                <li>Deployed **Longhorn** for persistent volume management, leveraging dedicated storage configured with **nfs-utils** and **iscsid** for reliable data persistence.</li>
                <li>Demonstrated meticulous planning and recovery skills by **re-imaging and re-partitioning systems** to optimize disk space after encountering limitations with XFS partition resizing.</li>
            </ul>
        </div>
        
        {/* Monitoring Stack */}
        <div>
            <h3>Monitoring &amp; Observability Stack 📊</h3>
            <p>
                **Project Goal:** Deploy a comprehensive monitoring solution to track cluster health, application performance, and external service availability.
            </p>
            <ul>
                <li>Deployed the full **Prometheus and Grafana** stack using **Helm** for centralized cluster monitoring, confirming proper integration with the Longhorn storage solution.</li>
                <li>Configured the **blackbox-exporter** to monitor the availability of external websites and services, establishing foundational observability practices.</li>
                <li>Planned integration to monitor **ReactJS**-based applications as they are deployed, ensuring monitoring evolves with application development.</li>
            </ul>
        </div>
        
        {/* CI/CD */}
        <div>
            <h3>Continuous Integration / Continuous Deployment (CI/CD) ⚙️</h3>
            <p>
                **Project Goal:** Implement an automated CI/CD pipeline for rapid, reliable application deployment from source code to the production cluster.
            </p>
            <ul>
                <li>Initiated the deployment of **Jenkins** on the Kubernetes cluster to manage application builds and deployments.</li>
                <li>Currently focusing on configuring **webhooks** and pipelines to automatically trigger website updates and deployments upon merging a pull request (PR) to the Git repository.</li>
            </ul>
        </div>

        {/* Cloud-Master.io */}
        <div>
            <h3>Cloud-Master.io (Portfolio &amp; Learning Hub) 💡</h3>
            <p>
                **Project Goal:** Create a public-facing web hub dedicated to compiling resources and training materials for IT certification and learning.
            </p>
            <ul>
                <li>Driving all development using **ReactJS**, directly showcasing front-end development capabilities alongside infrastructure expertise.</li>
                <li>The project acts as a live, evolving portfolio, integrating many of the aforementioned infrastructure components (Kubernetes hosting, Prometheus monitoring).</li>
            </ul>
        </div>
        
        {/* AI Integration */}
        <div>
            <h3>Future AI Integration (LM Studio) 🤖</h3>
            <p>
                **Future Goal:** Experiment with local AI models to enhance user support and troubleshooting capabilities on the Cloud-Master.io platform.
            </p>
            <ul>
                <li>Experimenting with **LM Studio** and local AI/ML models to provide an interactive support bot.</li>
                <li>The bot will allow users to troubleshoot common issues by talking directly with a curated AI model.</li>
            </ul>
        </div>
    </section>
      
    </Container>

  )
}

export default Projects