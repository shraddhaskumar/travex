import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './booking.css';

const Booking = () => {
  const { packageID } = useParams();
  const [bookingData, setBookingData] = useState({
    clientID: '1', // Assuming clientID is being fetched or set elsewhere
    numberOfPeople: 1,
    totalCost: 0,
  });
  const [packageDetails, setPackageDetails] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3033/packages/${packageID}`);
        const data = await response.json();
        setPackageDetails(data);
        setBookingData((prevData) => ({
          ...prevData,
          totalCost: data.Cost * prevData.numberOfPeople
        }));
      } catch (error) {
        console.error('Error fetching package details:', error);
      }
    };

    fetchPackageDetails();
    setCurrentDate(new Date().toISOString().split('T')[0]);
  }, [packageID]);

  useEffect(() => {
    if (isSubmitted) {
      fetchUserBookings();
    }
  }, [isSubmitted]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
      totalCost: name === 'numberOfPeople' ? packageDetails.Cost * value : prevData.totalCost
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submissionData = {
      ClientID: bookingData.clientID,
      PackageID: packageID,
      BookingDate: currentDate,
      NumberOfPeople: bookingData.numberOfPeople,
      TotalCost: bookingData.totalCost
    };

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
      } else {
        console.error('Failed to save booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`http://localhost:3033/bookings/${bookingData.clientID}`);
      const data = await response.json();
      setUserBookings(data);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  };

  if (!packageDetails) return <div>Loading...</div>;

  return (
    <div className="booking-page">
      <h1>Booking Page for {packageDetails.Name}</h1>
      <div className="package-details">
        <h2>Package Details</h2>
        <p>Name: {packageDetails.Name}</p>
        <p>Description: {packageDetails.Description}</p>
        <p>Duration: {packageDetails.Duration} days</p>
        <p>Cost per person: ${packageDetails.Cost}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Booking Date:</label>
          <input type="date" value={currentDate} readOnly />
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
        <button type="submit" disabled={isSubmitted}>
          {isSubmitted ? 'Submitted' : 'Submit Booking'}
        </button>
      </form>

      {isSubmitted && (
        <div className="user-bookings">
          <h2>My Bookings</h2>
          {userBookings.map((booking) => (
            <div key={booking.BookingID} className="booking-item">
              <p>Package: {booking.PackageName}</p>
              <p>Date: {new Date(booking.BookingDate).toLocaleDateString()}</p>
              <p>People: {booking.NumberOfPeople}</p>
              <p>Total Cost: ${booking.TotalCost}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Booking;