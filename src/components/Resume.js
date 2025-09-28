import { Container } from 'react-bootstrap'
import Navigation from "./Navigation"
import Footer from "./Footer"

const Resume = () => {
  return (
    <>
          <Navigation />
          <Container className="p-4 shadow-lg">
             
          <section>
            <h2>Bed Bath and Beyond</h2>
            <h4>March 2021 - Present</h4>
            <ul>
              <li>Maintained high system availability and performance by managing critical infrastructure components across compute, network, storage, and databases. </li>
              <li>Managed cloud infrastructure and optimization, implementing innovative solutions to enhance system capabilities. </li>
              <li>Advanced Beyond's cloud integration efforts, ensuring compatibility between private and public cloud ecosystems, which improved service offerings.</li>
              <li>Configured Openstack Systems, deploying with Kolla Ansible and running Ceph Storage.</li>
            </ul>
          </section>

          <section>
            <h2>Ancestry</h2>
            <h4>August 2018 - February 2021</h4>
            <ul>
              <li>Conducted real-time monitoring and troubleshooting of website systems using New Relic and AWS console. </li>
              <li>Enhanced team responsiveness by leading communication through PagerDuty, improving issue resolution times.</li>
              <li>Developed custom internal tools with Python and BASH scripting, automating system management tasks.</li>
              <li>Contributed to Ancestry's mission of connecting families by ensuring peak system performance.</li>
            </ul>
          </section>
          <section>
            <h2>Bluehost</h2>
            <h4>October 2012 - October 2017</h4>
            <ul>
              <li>Resolved load and performance issues across shared, cloud, reseller, and VPS environments, ensuring optimal system availability. </li>
              <li>Enhanced process reliability and user experience by addressing software and migration challenges effectively. </li>
              <li>Employed advanced recovery techniques to minimize data loss and downtime during critical incidents.</li>
              <li>Managed security and compliance efforts, maintaining a secure hosting environment by addressing abusive accounts.</li>
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