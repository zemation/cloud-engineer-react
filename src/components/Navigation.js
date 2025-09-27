import {  Navbar, Nav } from 'react-bootstrap'

const Navigation = () => {
  return (

    <Navbar bg="dark" variant="dark" className="justify-content-center">
    
      <Nav>
        <Nav.Link to="/">Home</Nav.Link>
        <Nav.Link to="/resume">Resume</Nav.Link>
        <Nav.Link to="/projects">Projects</Nav.Link>
        <Nav.Link to="/about">About</Nav.Link>
      </Nav>

    </Navbar>
  )
}

export default Navigation