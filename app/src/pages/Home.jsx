import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './home.css';


const sliderImages = [
  { src: "https://wallpaperaccess.com/full/185289.jpg", alt: "Travel destination 1" },
  { src: "https://wallpaperaccess.com/full/185382.jpg", alt: "Travel destination 2" },
  { src: "https://wallpaperaccess.com/full/1510615.jpg", alt: "Travel destination 3" },
];
 
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  return (
    <div className="home">
      <div className="slider-container">
        <button onClick={prevSlide} className="slider-btn slider-btn-left">
          <ChevronLeft size={16} />
        </button>
        <img 
          src={sliderImages[currentSlide].src} 
          alt={sliderImages[currentSlide].alt} 
          className="slider-image"
        />
        <button onClick={nextSlide} className="slider-btn slider-btn-right">
          <ChevronRight size={16} />
        </button>
      </div>

      <section className="featured-packages">
        <h2>Featured Packages</h2>
        <div className="package-grid">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="package-card">
              <img src={`https://cdn.wallpapersafari.com/83/8/IeapF0.jpg`} alt={`Package ${num}`} />
              <h3>Package {num}</h3>
              <p>Explore the wonders of Destination {num}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>About Travex</h2>
        <p>Travex is your ultimate travel companion, offering curated packages that blend adventure, comfort, and unforgettable experiences. Whether you're seeking a relaxing beach getaway, an exciting city exploration, or an off-the-beaten-path adventure, we have the perfect package for you. Our team of travel experts ensures that every aspect of your journey, from accommodations to transportation, is seamlessly arranged, allowing you to focus on creating lasting memories.</p>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Your Journey?</h2>
        <p>Browse our packages and find your perfect getaway today!</p>
        <Link to="/packages" className="cta-button">Explore Packages</Link>
      </section>
    </div>
  );
}

export default Home;