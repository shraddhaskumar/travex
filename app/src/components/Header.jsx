import React from 'react'
import './style1.css'

const Header = () => {
  return (
    <>

<header>
    <nav>
      <div class="logo">
        <h1>Travex</h1>
      </div>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="#">Destinations</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="about.html">About Us</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#" id="loginBtn">Login</a></li>
        <li><a href="#" id="signupBtn">Sign Up</a></li>
      </ul>
    </nav>
    <div class="hero">
      <h2>Explore the World with Travex</h2>
      <p>Your adventure awaits. Find the perfect destination for your next journey.</p>
      <a href="#" class="btn">Get Started</a>
    </div>
  </header>
    
    </>
  )
}

export default Header