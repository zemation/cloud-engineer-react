import {Container, Row, Col} from 'react-bootstrap'


const About = () => {
  return (

    <Container className="p-4 shadow-lg w-50">
      <Row>
        <Col xs={12} md={3}>
              <div>            
     <img id="avatar" src="/images/avatar.jpg" alt="Headshot" className="img-fluid mx-auto" />
     </div>
        </Col>
        <Col xs={12} md={9}>
        
         <section>
        <h2>About Me</h2>
        
        {/* Paragraph 1: Summary and Personal Hook */}
        <p>
            Hello and welcome. I am a dedicated **Systems and Cloud Infrastructure Engineer** with over 
            **20 years of experience** spanning local support, global enterprise operations, and modern cloud environments. 
            When I'm not focused on optimizing Kubernetes clusters and cloud infrastructure, I am a proud father of two young men. 
            My career began with earning my **CompTIA A+ in 1999**, establishing a foundation that has since grown into expertise in **Linux, OpenStack, AWS, and Kubernetes**.
        </p>

        {/* Paragraph 2: The Technical Foundation (Early Career) */}
        <p>
            My technical foundation was forged in hands-on hardware and software support, working as a **Technician** for a local computer shop and later as a **Resolution Specialist** for Dell, where I mastered **deep-dive hardware troubleshooting** and customer service. This evolved into remote support at iTok/Bask, where I provided high-level maintenance, software support, 
            and malware cleanup for diverse client systems.
        </p>

        {/* Paragraph 3: Scaling to Enterprise Operations */}
        <p>
            I transitioned into web hosting and cloud operations, first as a **Junior System Administrator** at **Bluehost**, 
            resolving complex issues across **Linux, cPanel**, and various server environments (shared, reseller, VPS). 
            Following that, I joined the **Ancestry Network Operations Center**, focusing on **website monitoring, outage coordination, 
            and documentation** to ensure the stability of critical online services.
        </p>

        {/* Paragraph 4: Modern Cloud & Orchestration Focus (Most Recent) */}
        <p>
            Most recently, I specialized in large-scale hybrid cloud management at **Overstock/Bed Bath & Beyond**. 
            In this role, I focused on high availability and optimization across private and public clouds 
            (**OpenStack, AWS, GCP**), with significant experience **managing and maintaining Kubernetes clusters**.
        </p>
    </section>
</Col>
      </Row>
    </Container>

  )
}

export default About