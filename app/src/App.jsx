import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Signup from './components/Signup';

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Place Header inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Route for Home */}
        <Route path="/about" element={<About />} /> {/* Route for About */}
        <Route path="/signup" element={<Signup />} /> {/* Route for Signup */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
