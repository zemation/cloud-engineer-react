import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Import Layout Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Import Page Components (Home, Resume, Projects, About)
import Home from "./components/Home";
import Resume from "./components/Resume";
import Projects from "./components/Projects";
import About from "./components/About";

const PAGE_TITLES = {
  "/": "Robert Rodgers | Cloud Infrastructure Engineer",
  "/resume": "Resume | Robert Rodgers — Cloud Infrastructure Engineer",
  "/projects": "Projects | Robert Rodgers — Cloud Infrastructure Engineer",
  "/about": "About | Robert Rodgers — Cloud Infrastructure Engineer",
};

function RouteChangeHandler() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.title = PAGE_TITLES[pathname] || "Page Not Found | A Cloud Engineer";
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RouteChangeHandler />
      <div className="App">
        <Navigation />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<div className="container content-panel mt-4 rounded-3 py-5 text-center"><h1>Page not found</h1><p>The page you requested does not exist.</p></div>} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
