import {  Container, Row, Navbar, Nav } from 'react-bootstrap'

const Footer = () => {
  return (
    <Container fluid className="mt-5">
      <Row>
      <Navbar className="justify-content-center">

        <Nav>
          <Nav.Item>
            <Nav.Link href="http://www.github.com/zemation" target="_blank"><i className="fa-brands fa-github"></i></Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="https://www.linkedin.com/in/robertbrodgers" target="_blank"><i className="fa-brands fa-linkedin"></i></Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="https://codepen.io/zemation" target="_blank"><i className="fa-brands fa-codepen"></i></Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="https://www.freecodecamp.org/zemationx" target="_blank"><i className="fa-brands fa-free-code-camp"></i></Nav.Link>
          </Nav.Item>
      </Nav>

      
    </Navbar>
    </Row>
    <Row className="text-center">
      <p>&copy; 2025 acloudengineer.com</p>      
    </Row>
    


    </Container>

  )
}

export default Footer