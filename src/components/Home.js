import Navbar from "./NavBar"
import Footer from "./Footer"

const Home = () => {
  return(
    <>
    <Navbar />
    <div id="jumbo">

      <div id="j-head">
      <h1>A Cloud Engineer</h1>
      <h2>Certified Cloud and System Administrator</h2>
      </div>
    </div>

    <div className="card-group">
      <div className="card">
        <div className="card-header">
          <h1>SysOps Admin</h1>
        </div>
        <div>
          <img className="card-img" src="/images/desk-admin.jpg" alt="Server Rack" />
        </div>
        <div className="card-body">
          <p>Certified Windows Support Specialist and Linux System Administrator. Working with PowerShell and BASH scripting.</p>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h1>Cloud Engineer</h1>          
        </div>
        <div>
          <img className="card-img" src="/images/cloud-servers.jpg" alt="Cloud Engineer" />
        </div>
        <div className="card-body">
          <p>Certified Cloud Professional, Systems Analysis and Site Reliability.</p>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h1>Web Developer</h1>          
        </div>
        <div>
          <img className="card-img" src="/images/web-dev.jpg" alt="Web Dev" />
        </div>
        <div className="card-body">
          <p>Two decades of experience with HTML and CSS, recently adding the Bootstrap framework and now building on JavaScript and NodeJS.</p>
        </div>
      </div>
    </div>
    <Footer />
 
    </>
  )
}

export default Home