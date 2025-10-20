import {Container, Row, Col } from 'react-bootstrap'
import Card from 'react-bootstrap/Card'


const Home = () => {
  return(

    <Container className="mt-5"> 

    <div className="text-center mb-5">

      <h1>A Cloud Engineer</h1>
      <h2>Certified Cloud and System Administrator</h2>
    </div>
    <Container className="mb-5">

      <Row className="d-flex justify-content-center">
        <Col lg={4} md={6} sm={12}>
       <Card className="h-100">
        <Card.Header className="text-center fs-4">SysOps Admin</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/desk-admin.jpg" className="img-fluid" />
          <Card.Text className="p-3">Certified Windows Support Specialist and Linux System Administrator. Working with PowerShell and BASH scripting.</Card.Text>

        </Card.Body>
        <Card.Footer className="text-muted">Operating Systems</Card.Footer>
      </Card>       
       </Col>


        <Col lg={4} md={6} sm={12}>
       <Card className="h-100">
        <Card.Header className="text-center fs-4">Cloud Engineer</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/cloud-servers.jpg" className="img-fluid" />
          <Card.Text className="p-3">Certified Cloud Professional, Systems Analysis and Site Reliability. Primarily focused in AWS with some GCP experience.</Card.Text>

        </Card.Body>
        <Card.Footer className="text-muted">Cloud Infrastructure</Card.Footer>
      </Card>       
      </Col>

        <Col lg={4} sm={6} xs={12}>
  
      <Card className="h-100">
        <Card.Header className="text-center fs-4">Web Developer</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/web-dev.jpg" className="img-fluid" />
          <Card.Text className="p-3">Two decades of experience with HTML and CSS, recently adding the Bootstrap framework and now building on JavaScript and NodeJS including this website that was build in ReactJS.</Card.Text>

        </Card.Body>
        <Card.Footer className="text-muted">Front End Web</Card.Footer>
      </Card>      
        
        
        </Col>
      </Row>
    </Container>



 
      <p>With over 20 years of experience in the technical field, starting with a CompTIA A+ and spanning roles from a local computer technician to a Network Operations Center specialist and finally managing Kubernetes Clusters on OpenStack, AWS, and GCP cloud systems, the author brings a wealth of expertise in hardware, customer support, Linux administration, and cloud infrastructure.</p>
     </Container>



  )
}

export default Home