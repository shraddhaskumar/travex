import React from 'react';

const Login = ({ onClose }) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        // Add your form submission logic here
        const formData = new FormData(event.target);
        const data = {
            clientIDorEmail: formData.get('clientIDorEmail'),
            password: formData.get('loginPassword'),
        };

        console.log(data); // For debugging; replace with actual submission logic
    };

    return (
        <>
            <div id="loginModal" className="modal">
                <div className="modal-content">
                    <span
                        className="close"
                        id="closeLogin"
                        onClick={onClose} // Close the modal when clicked
                    >
                        &times;
                    </span>
                    <h2>Login</h2>
                    <form id="loginForm" onSubmit={handleSubmit}>
                        <label htmlFor="clientIDorEmail">Client ID or Email:</label>
                        <input type="text" id="clientIDorEmail" name="clientIDorEmail" required />

                        <label htmlFor="loginPassword">Password:</label>
                        <input type="password" id="loginPassword" name="loginPassword" required />

                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;