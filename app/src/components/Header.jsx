import React, { useState } from 'react';
import Signup from './Signup';
import './header.css';
import Login  from './Login';

const Header = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <>
            <header>
                <nav>
                    <div className="logo">
                        <h1>Travex</h1>
                    </div>
                    <ul className="nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/packages">PACKAGES</a></li>
                        <li><a href="/accommodations/:packageID">ACCOMODATIONS</a></li>
                        <li><a href="/transportation/:packageID">TRANSPORT</a></li>
                        <li><a href="#">BOOKINGS</a></li>
                        <li><a href="/about">About Us</a></li>                     
                        <li><a href="#" id="loginBtn"
                        onClick={() => setShowLoginModal(true)} 
                        >Login</a></li>
                        <li>
                            <a
                                href="#"
                                id="signupBtn"
                                onClick={() => setShowSignupModal(true)} // Open Signup modal
                            >
                                Sign Up
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Show Signup Modal when state is true */}
            {showSignupModal && (
                <Signup onClose={() => setShowSignupModal(false)} />
            )}
             {/* Show Logup Modal when state is true */}
             {showLoginModal && (
                <Login onClose={() => setShowLoginModal(false)} />
            )}
        </>
    );
};

export default Header;
