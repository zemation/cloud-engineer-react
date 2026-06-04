import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import Layout Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Import Page Components (Home, Resume, Projects, About)
import Home from "./components/Home";
import Resume from "./components/Resume";
import Projects from "./components/Projects";
import About from "./components/About";
import UnityGame from "./components/UnityGame";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/game" element={<UnityGame />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;