import {  Navbar, Nav } from 'react-bootstrap'

const Navigation = () => {
  return (

    <Navbar bg="dark" variant="dark" className="justify-content-center">
    
      <Nav>
        <Nav.Item>
          <Nav.Link href="/">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/resume">Resume</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/projects">Projects</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/about">About</Nav.Link>
        </Nav.Item>
      </Nav>

    </Navbar>
  )
}

export default Navigation