import {  Navbar, Nav } from 'react-bootstrap'

const Navigation = () => {
  return (

    <Navbar bg="dark" variant="dark" className="justify-content-center">
    
      <Nav>
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/resume">Resume</Nav.Link>
        <Nav.Link href="/projects">Projects</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
      </Nav>

    </Navbar>
  )
}

export default Navigation