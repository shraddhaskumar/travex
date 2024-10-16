import React, { useState, useEffect } from 'react';
import './sign_up.css'; // Add styles as needed

const Signup = ({ onClose }) => {
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        let timer;
        if (isSignedUp) {
            setShowMessage(true);
            timer = setTimeout(() => {
                onClose();
            }, 2000); // Close after 2 seconds
        }
        return () => clearTimeout(timer);
    }, [isSignedUp, onClose]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            name: formData.get('signupName'),
            email: formData.get('signupEmail'),
            phoneNumber: formData.get('signupPhoneNumber'),
            address: formData.get('signupAddress'),
            preferences: formData.get('signupPreferences'),
            password: formData.get('signupPassword'),
            confirmPassword: formData.get('confirmPassword'),
        };

        console.log(data); // For debugging

        try {
            const response = await fetch('http://localhost:3033/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            

            if (response.ok) {
                const responseData = await response.json();
                console.log('Signup successful:', responseData);
                setIsSignedUp(true);
            } else {
                console.error('Signup failed:', response.statusText);
                // Optionally, you can set an error state here and display an error message
            }
        } catch (error) {
            console.error('Error during signup:', error);
            // Optionally, you can set an error state here and display an error message
        }
    };

    return (
        <div id="signupModal" className="modal">
            <div className="modal-content">
                <span className="close" id="closeSignup" onClick={onClose}>
                    &times;
                </span>
                <h2>Sign Up</h2>
                {showMessage ? (
                    <div className="success-message">Signed up successfully!</div>
                ) : (
                    <form id="signupForm" onSubmit={handleSubmit}>
                        <label htmlFor="signupName">Name:</label>
                        <input type="text" id="signupName" name="signupName" required />

                        <label htmlFor="signupEmail">Email:</label>
                        <input type="email" id="signupEmail" name="signupEmail" required />

                        <label htmlFor="signupPhoneNumber">Phone Number:</label>
                        <input type="tel" id="signupPhoneNumber" name="signupPhoneNumber" required />

                        <label htmlFor="signupAddress">Address:</label>
                        <input type="text" id="signupAddress" name="signupAddress" required />

                        <label htmlFor="signupPreferences">Preferences:</label>
                        <select id="signupPreferences" name="signupPreferences" required>
                            <option value="Cultural">Cultural</option>
                            <option value="Adventure">Adventure</option>
                            <option value="Luxury">Luxury</option>
                        </select>

                        <label htmlFor="signupPassword">Password:</label>
                        <input type="password" id="signupPassword" name="signupPassword" required />

                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required />

                        <button type="submit">Sign Up</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Signup;