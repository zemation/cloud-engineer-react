import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
      <div id="social-media">
        <Link to="http://www.github.com/zemation" target="_blank"><i className="fa-brands fa-linkedin"></i></Link>
        <Link to="https://www.linkedin.com/in/robertbrodgers" target="_blank"><i className="fa-brands fa-github"></i></Link>
        <Link to="https://codepen.io/zemation" target="_blank"><i class="fa-brands fa-codepen"></i></Link>
        <Link to="https://www.freecodecamp.org/zemationx" target="_blank"><i class="fa-brands fa-free-code-camp"></i></Link>

      </div>
      <div>
        <p>Copyright 2025 acloudengineer.com</p>
      </div>
    </footer>
  )
}

export default Footer