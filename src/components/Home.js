import {Container} from 'react-bootstrap'
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Navigation from "./Navigation"
import Footer from "./Footer"

const Home = () => {
  return(
    <>
    <Navigation />
    <Container>

    <div className="text-center mt-5 mb-5">

      <h1>A Cloud Engineer</h1>
      <h2>Certified Cloud and System Administrator</h2>
    </div>
      <CardGroup className="mb-5">
      <Card style={{ width: '18rem' }}>
        <Card.Header >SysOps Admin</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/desk-admin.jpg" />
          <Card.Text><p>Certified Windows Support Specialist and Linux System Administrator. Working with PowerShell and BASH scripting.</p></Card.Text>

        </Card.Body>
      </Card>
      <Card style={{ width: '18rem' }}>
        <Card.Header>Cloud Engineer</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/cloud-servers.jpg" />
          <Card.Text><p>Certified Cloud Professional, Systems Analysis and Site Reliabilityg.</p></Card.Text>

        </Card.Body>
      </Card>
      <Card style={{ width: '18rem' }}>
        <Card.Header>SysOps Admin</Card.Header>
        
        <Card.Body>
          <Card.Img src="/images/web-dev.jpg" />
          <Card.Text><p>Two decades of experience with HTML and CSS, recently adding the Bootstrap framework and now building on JavaScript and NodeJS including this website that was build in ReactJS.</p></Card.Text>

        </Card.Body>
      </Card>
      </CardGroup>
      <p>With over 20 years of experience in the technical field, starting with a CompTIA A+ and spanning roles from a local computer technician to a Network Operations Center specialist and finally managing Kubernetes Clusters on OpenStack, AWS, and GCP cloud systems, the author brings a wealth of expertise in hardware, customer support, Linux administration, and cloud infrastructure.</p>
     </Container>



    <Footer />
 
    </>
  )
}

export default Home