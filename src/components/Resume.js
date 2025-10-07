import { Container } from 'react-bootstrap'
import Navigation from "./Navigation"
import Footer from "./Footer"

const Resume = () => {
  return (
    <>
          <Navigation />
          <Container className="p-4 shadow-lg w-50">
             
          <section>
            <h2>Bed Bath and Beyond</h2>
            <h4>March 2021 - Present</h4>
            <ul>
              <li>Drove high system availability (99.99%+) and performance by managing critical cloud infrastructure, including configuring and maintaining internal networking and storage for the OpenStack cluster across compute, networking, and database tiers. </li>
              <li>Led cloud infrastructure optimization efforts, implementing innovative IaaS/PaaS solutions to enhance system capabilities and reduce operational costs. </li>
              <li>Managed and governed access to public cloud resources (AWS/GCP), reducing cloud spend by proactively identifying and deleting unused accounts and provisioning role-based permissions for users and services.</li>
              <li>Architected and deployed production OpenStack environments using Kolla Ansible for automated deployment and Ceph Storage for scalable, resilient block and object storage.</li>
            </ul>
          </section>

          <section>
            <h2>Ancestry</h2>
            <h4>August 2018 - February 2021</h4>
            <ul>
              <li>Ensured platform reliability by conducting real-time monitoring and troubleshooting of mission-critical systems using New Relic and the AWS console </li>
              <li>Enhanced team responsiveness by leading communication through PagerDuty, improving issue resolution times.</li>
              <li>Contributed to the development and deployment of custom automation tools using Python and BASH scripting, helping to streamline routine system administration tasks across the infrastructure.</li>
            </ul>
          </section>
          <section>
            <h2>Bluehost</h2>
            <h4>October 2012 - October 2017</h4>
            <ul>
              <li>Optimized and resolved complex load and performance bottlenecks across diverse hosting environments (Shared, Cloud, Reseller, and VPS), maintaining 99.9%+ system uptime.</li>
              <li>Resolved critical performance bottlenecks and complex software issues on CentOS 6 servers by leveraging advanced Linux tools including sar, vmstat, strace, and netstat to ensure system stability and meet SLA goals. </li>
              <li>Drove efficient resolution of production issues by coordinating internal/external groups, handling escalations, and serving as the technical liaison for Root Cause Analysis (RCA) with engineering teams..</li>
              <li>Maintained system security and compliance by proactively managing access controls, mitigating threats, and addressing abusive accounts within the hosting environment.</li>
            </ul>
          </section>

          <section>
            <h2>Certification</h2>
            <ul>
              <li>CompTIA A+</li>
              <li>CompTIA Linux+</li>
              <li>CompTIA Cloud+</li>
              <li>CompTIA Security+</li>
              <li>LPIC-1: Linux Administrator</li>
              <li>AWS SysOps Administrator</li>
              <li>Currently working towards Certified Kubernetes Administrator</li>
            </ul>
          </section>

          <section>
            <h2>Skills</h2>
            <p>Cloud Computing, Linux Administration, Problem Analysis, Containerization, Troubleshooting, Root Cause Analysis, Communication, Infrastructure as a Service (IaaS), Technical Documentation, Analytical Skills, Front-End Development, Linux, Microsoft Windows, Amazon Web Services, Google Cloud Platform, Openstack, System Administration, Technical Support, BASH, Python, Computer Hardware, PowerShell, Bootstrap, Problem Solving, New Relic, Kubernetes, Docker, SSH, API, Git, Packer, Cloud Panel, CPanel, NodeJS, Django, Load Balancers, </p>
          </section>
          </Container>
          <Footer/>
    </>
  )
}

export default Resume