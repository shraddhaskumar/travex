import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Signup from './components/Signup';
import Login from './components/Login';
import Packages from './pages/Packages'; 
import Accomodations from './pages/Accomodations';
import Transportation from './pages/Transportation'; 

function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Place Header inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Route for Home */}
        <Route path="/about" element={<About />} /> {/* Route for About */}
        <Route path="/signup" element={<Signup />} /> {/* Route for Signup */}
        <Route path="/login" element={<Login />} /> {/* Route for Login */}
        <Route path="/packages" element={<Packages />} />
        <Route path="/accommodations/:packageID" element={<Accomodations />} /> {/* Add the route for accommodations */}
      
        <Route path="/transportation/:packageID" element={<Transportation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
