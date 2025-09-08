import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div id="social-media">
        <Link to="http://www.github.com/zemation"><i className="fa-brands fa-linkedin"></i></Link>
        <Link to="https://www.linkedin.com/robertbrodgers"><i className="fa-brands fa-github"></i></Link>

      </div>
      <div>
        <p>Copyright 2025 acloudengineer.com</p>
      </div>
    </footer>
  )
}

export default Footer