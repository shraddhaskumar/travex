import React, { useState } from 'react';
import Signup from './Signup';
import './header.css';

const Header = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);

    return (
        <>
            <header>
                <nav>
                    <div className="logo">
                        <h1>Travex</h1>
                    </div>
                    <ul className="nav-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#" id="loginBtn">Login</a></li>
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
        </>
    );
};

export default Header;
