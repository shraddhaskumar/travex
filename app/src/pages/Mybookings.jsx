import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './mybookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const clientID = localStorage.getItem('clientID');

  useEffect(() => {
    if (!clientID) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [clientID, navigate]);

  const fetchBookings = async () => {
    try {
      const response = await fetch(`http://localhost:3033/bookings/${clientID}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err) {
      setError('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingID) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:3033/bookings/${bookingID}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setBookings(prevBookings =>
            prevBookings.filter(booking => booking.BookingID !== bookingID)
          );
        } else {
          setError('Failed to cancel booking');
        }
      } catch (err) {
        setError('Error cancelling booking');
      }
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div>{error}</div>
    </div>
  );

  return (
    <div className="container">
      <h1>My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>No bookings yet</p>
          <button 
            onClick={() => navigate('/packages')}
            className="cancel-button"
            style={{ backgroundColor: '#00aeff' }}
          >
            Browse Packages
          </button>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div
              key={booking.BookingID}
              className="booking-card"
            >
              <h3>{booking.PackageName}</h3>
              <div className="booking-details">
                <div className="booking-detail-item">
                  <span className="detail-label">Booking ID:</span>
                  <span className="detail-value">{booking.BookingID}</span>
                </div>
                <div className="booking-detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(booking.BookingDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="booking-detail-item">
                  <span className="detail-label">Number of People:</span>
                  <span className="detail-value">{booking.NumberOfPeople}</span>
                </div>
                <div className="booking-detail-item">
                  <span className="detail-label">Total Cost:</span>
                  <span className="detail-value">${booking.TotalCost}</span>
                </div>
              </div>
              <button
                onClick={() => handleCancelBooking(booking.BookingID)}
                className="cancel-button"
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;