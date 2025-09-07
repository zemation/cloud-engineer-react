import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from "./components/Home"
import Resume from "./components/Resume"
import Projects from "./components/Projects"
import About from "./components/About"

function App() {

  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home />}></Route> 
      <Route path="/resume" element={<Resume />}></Route> 
      <Route path="/projects" element={<Projects />}></Route> 
      <Route path="/about" element={<About />}></Route> 
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
