import React, { useState } from 'react';

const Login = ({ onClose, onLoginSuccess }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            clientIDorEmail: formData.get('clientIDorEmail'),
            password: formData.get('loginPassword'),
        };

        try {
            const response = await fetch('http://localhost:3033/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Login successful:', responseData);
                localStorage.setItem('clientID', responseData.clientID);
                setIsLoggedIn(true);
                setErrorMessage('');
                if (onLoginSuccess) {
                    onLoginSuccess(responseData.clientID);
                }
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData.message);
                setErrorMessage(errorData.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };
    return (
        <div id="loginModal" className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Login</h2>
                {isLoggedIn ? (
                    <div className="success-message">Login successful!</div>
                ) : (
                    <form id="loginForm" onSubmit={handleSubmit}>
                        <label htmlFor="clientIDorEmail">Client ID or Email:</label>
                        <input type="text" id="clientIDorEmail" name="clientIDorEmail" required />

                        <label htmlFor="loginPassword">Password:</label>
                        <input type="password" id="loginPassword" name="loginPassword" required />

                        {errorMessage && <div className="error-message">{errorMessage}</div>}

                        <button type="submit">Login</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;