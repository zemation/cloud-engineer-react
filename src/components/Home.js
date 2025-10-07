import {Container, Row, Col } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import Navigation from "./Navigation"
import Footer from "./Footer"

const Home = () => {
  return(
    <>
    <Navigation />
    <Container className="mt-5"> 

    <div className="text-center mb-5">

      <h1>A Cloud Engineer</h1>
      <h2>Certified Cloud and System Administrator</h2>
    </div>
    <Container className="mr-auto ml-auto justify-content-center">

      <Row>
        <Col lg={3} md={4} sm={6} xs={12}>
       <Card style={{ width: '18rem' }}>
        <Card.Header className="text-center fs-4">SysOps Admin</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/desk-admin.jpg" className="img-fluid" />
          <Card.Text>Certified Windows Support Specialist and Linux System Administrator. Working with PowerShell and BASH scripting.</Card.Text>

        </Card.Body>
      </Card>       
       </Col>


        <Col lg={3} md={4} sm={6} xs={12}>
       <Card style={{ width: '18rem' }}>
        <Card.Header className="text-center fs-4">Cloud Engineer</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/cloud-servers.jpg" className="img-fluid" />
          <Card.Text>Certified Cloud Professional, Systems Analysis and Site Reliability.</Card.Text>

        </Card.Body>
      </Card>       
      </Col>

        <Col lg={3} md={4} sm={6} xs={12}>
  
      <Card style={{ width: '18rem' }}>
        <Card.Header className="text-center fs-4">Web Developer</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/web-dev.jpg" className="img-fluid" />
          <Card.Text>Two decades of experience with HTML and CSS, recently adding the Bootstrap framework and now building on JavaScript and NodeJS including this website that was build in ReactJS.</Card.Text>

        </Card.Body>
      </Card>      
        
        
        </Col>
      </Row>
    </Container>



 
      <p>With over 20 years of experience in the technical field, starting with a CompTIA A+ and spanning roles from a local computer technician to a Network Operations Center specialist and finally managing Kubernetes Clusters on OpenStack, AWS, and GCP cloud systems, the author brings a wealth of expertise in hardware, customer support, Linux administration, and cloud infrastructure.</p>
     </Container>



    <Footer />
 
    </>
  )
}

export default Home