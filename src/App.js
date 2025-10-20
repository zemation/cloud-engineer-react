import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; // Make sure you import the CSS file with the new rules

// Import Layout Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Import Page Components (Home, Resume, Projects, About)
import Home from "./components/Home";
import Resume from "./components/Resume";
import Projects from "./components/Projects";
import About from "./components/About";

function App() {
  return (
    <BrowserRouter>
      {/* 🌟 KEY CHANGE: Wrap everything in a div with the 'App' class */}
      <div className="App"> 
        <Navigation />
        
        {/* The 'main' tag is the one that will receive flex-grow: 1 */}
        <main> 
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/resume" element={<Resume />} /> 
            <Route path="/projects" element={<Projects />} /> 
            <Route path="/about" element={<About />} /> 
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;