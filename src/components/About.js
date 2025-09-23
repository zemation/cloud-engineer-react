import NavBar from "./NavBar"
import Footer from "./Footer"

const About = () => {
  return (
    <>
    <NavBar />
    <main>
      {/*
      <div>            
     <img id="avatar" src="/images/avatar.jpg" alt="Headshot" />
     </div>
        */}
     <div>
      <p>Hello and welcome. My name is Robert. I am a father of two young men. I have been in the technical field for over 20 years, starting with working towards/achieving my CompTIA A+ Certification in 1999. Since that time I have worked several local and global companies.</p>
      <p>Technician for a local computer shop in King City, California doing computer troubleshooting and repair work for the community of King City and surrounding areas.</p>
      <p>A Resolution Specialist supporting Dell XPS, Dimension and Inspiron computers, ensuring customer systems were properly troubleshot and qualifying parts were replaced as needed.</p>
      <p>Worked for a remote support company called iTok (now Bask) supporting a variety of customer hardware and software issues, periodic cleanup malware and temporary files and maintenence services.</p>
      <p>Junior System Admin for Bluehost, resolving issues with Linux, cPanel and other web services for shared, reseller and VPS/Dedicated server clients.</p>
      <p>Ancestry Network Operations Center, monitoring the Website services, coordinating outage resolution, documenting issues, managing cloud services.</p>
      <p>Overstock supporting private and public cloud systems running OpenStack, AWS and GCP and managing systems running Kubernetes Clusters.</p>
      </div>

    </main>
    <Footer/>
    </>
  )
}

export default About