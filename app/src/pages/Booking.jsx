import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './booking.css';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { packageDetails } = location.state || {};
  const [bookingData, setBookingData] = useState({
    clientID: localStorage.getItem('clientID') || '',
    numberOfPeople: 1,
    totalCost: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [previousBookings, setPreviousBookings] = useState([]);

  useEffect(() => {
    if (!packageDetails) {
      console.log('No package details found, navigating to packages page');
      navigate('/packages');
    } else {
      console.log('Package details:', packageDetails);
      setBookingData(prevData => ({
        ...prevData,
        totalCost: packageDetails.Cost * prevData.numberOfPeople
      }));
      fetchPreviousBookings();
    }
  }, [packageDetails, navigate]);

  const fetchPreviousBookings = async () => {
    try {
      const response = await fetch(`http://localhost:3033/bookings/${bookingData.clientID}`);
      if (response.ok) {
        const data = await response.json();
        setPreviousBookings(data);
      } else {
        console.error('Failed to fetch previous bookings');
      }
    } catch (error) {
      console.error('Error fetching previous bookings:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingData(prevData => ({
      ...prevData,
      [name]: value,
      totalCost: name === 'numberOfPeople' ? packageDetails.Cost * parseInt(value) : prevData.totalCost
    }));
    console.log('Updated booking data:', bookingData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    const submissionData = {
      ClientID: bookingData.clientID,
      PackageID: packageDetails.PackageID,
      BookingDate: new Date().toISOString().split('T')[0],
      NumberOfPeople: parseInt(bookingData.numberOfPeople),
      TotalCost: bookingData.totalCost
    };
  
    console.log('Submitting booking data:', submissionData);
  
    try {
      const response = await fetch('http://localhost:3033/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
  
      if (response.ok) {
        console.log('Booking saved successfully!');
        setIsSubmitted(true);
        fetchPreviousBookings();
      } else {
        console.error('Failed to save booking');
        setError('Failed to save booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setError('An error occurred while submitting the booking. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingID) => {
    try {
      const response = await fetch(`http://localhost:3033/bookings/${bookingID}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Booking cancelled successfully');
        // Remove the cancelled booking from the state
        setPreviousBookings(prevBookings => 
          prevBookings.filter(booking => booking.BookingID !== bookingID)
        );
      } else {
        console.error('Failed to cancel booking');
        setError('Failed to cancel booking. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('An error occurred while cancelling the booking. Please try again later.');
    }
  };

  if (!packageDetails) return null;

  return (
    <div className="booking-page">
      <h1>Booking Page for {packageDetails.PackageName}</h1>
      <div className="package-details">
        <h2>Package Details</h2>
        <p>Package ID: {packageDetails.PackageID}</p>
        <p>Cost per person: ${packageDetails.Cost}</p>
      </div>
      
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Booking Date:</label>
            <input type="date" value={new Date().toISOString().split('T')[0]} readOnly />
          </div>
          <div>
            <label>Number of People:</label>
            <input
              type="number"
              name="numberOfPeople"
              value={bookingData.numberOfPeople}
              onChange={handleInputChange}
              min="1"
            />
          </div>
          <div>
            <label>Total Cost:</label>
            <input type="text" value={`$${bookingData.totalCost.toFixed(2)}`} readOnly />
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      ) : (
        <div className="booking-confirmation">
          <h2>Booking Confirmed!</h2>
          <p>Package ID: {packageDetails.PackageID}</p>
          <p>Number of People: {bookingData.numberOfPeople}</p>
          <p>Total Cost: ${bookingData.totalCost.toFixed(2)}</p>
          <p>Booking Date: {new Date().toISOString().split('T')[0]}</p>
        </div>
      )}

      <div className="previous-bookings">
        <h2>Previous Bookings</h2>
        {previousBookings.length > 0 ? (
          <div className="booking-grid">
            {previousBookings.map(booking => (
              <div key={booking.BookingID} className="booking-box">
                <p>Package: {booking.PackageName}</p>
                <p>Date: {new Date(booking.BookingDate).toLocaleDateString()}</p>
                <p>People: {booking.NumberOfPeople}</p>
                <p>Total Cost: ${booking.TotalCost}</p>
                <button 
                  onClick={() => handleCancelBooking(booking.BookingID)}
                  className="cancel-booking-btn"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No previous bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default Booking;