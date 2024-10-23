import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Signup from './components/Signup';
import Login from './components/Login';
import Packages from './pages/Packages';
import Accomodations from './pages/Accomodations';
import Transportation from './pages/Transportation';
import Booking from './pages/Booking';
import Mybookings from './pages/Mybookings';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/accommodations/:packageID" element={<Accomodations />} />
        <Route path="/transportation/:packageID" element={<Transportation />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/mybookings" element={<Mybookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;