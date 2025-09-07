import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div id="nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/resume">Resume</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>

    </div>
  )
}

export default NavBar