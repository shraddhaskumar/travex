import React, { useState, useEffect } from 'react';
import Signup from './Signup';
import Login from './Login';
import './header.css';

const Header = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [clientId, setClientId] = useState('');

    useEffect(() => {
        const checkLoginStatus = () => {
            const storedClientId = localStorage.getItem('clientID');
            if (storedClientId) {
                setIsLoggedIn(true);
                setClientId(storedClientId);
            } else {
                setIsLoggedIn(false);
                setClientId('');
            }
        };

        checkLoginStatus();

        // Add event listener for storage changes
        window.addEventListener('storage', checkLoginStatus);

        // Clean up event listener
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('clientID');
        setIsLoggedIn(false);
        setClientId('');
    };

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
                        <li><a href="/booking/:packageID">BOOKINGS</a></li>
                        <li><a href="/about">About Us</a></li>
                        {isLoggedIn ? (
                            <>
                                <li><span style={{ color: '#007bff', padding: '10px 15px' }}>Client ID: {clientId}</span></li>
                                <li><a href="#" onClick={handleLogout}>Logout</a></li>
                            </>
                        ) : (
                            <>
                                <li><a href="#" onClick={() => setShowLoginModal(true)}>Login</a></li>
                                <li><a href="#" onClick={() => setShowSignupModal(true)}>Sign Up</a></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            {showSignupModal && (
                <Signup 
                    onClose={() => setShowSignupModal(false)}
                    onSignupSuccess={(clientId) => {
                        setIsLoggedIn(true);
                        setClientId(clientId);
                        setShowSignupModal(false);
                    }}
                />
            )}

            {showLoginModal && (
                <Login 
                    onClose={() => setShowLoginModal(false)}
                    onLoginSuccess={(clientId) => {
                        setIsLoggedIn(true);
                        setClientId(clientId);
                        setShowLoginModal(false);
                    }}
                />
            )}
        </>
    );
};

export default Header;