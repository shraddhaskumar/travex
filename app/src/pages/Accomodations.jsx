import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate for redirection
import './accomodations.css'; // Optional: For styling

const Accommodations = () => {
  const { packageID } = useParams(); // Get the PackageID from the URL
  const navigate = useNavigate(); // Use navigate for redirection
  const [accommodations, setAccommodations] = useState([]);
  const [filters, setFilters] = useState({
    checkInDate: '',
    checkOutDate: '',
    roomType: ''
  });

  const [selectedAccommodation, setSelectedAccommodation] = useState({
    HotelName: '',
    Location: ''
  });

  useEffect(() => {
    // Fetch accommodations based on the packageID
    const fetchAccommodations = async () => {
      try {
        const response = await fetch(`http://localhost:3033/accommodations/${packageID}`);
        const data = await response.json();
        setAccommodations(data); // Assuming the API returns an array of accommodations
      } catch (error) {
        console.error('Error fetching accommodations:', error);
      }
    };

    fetchAccommodations();
  }, [packageID]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleAccommodationSelection = (accommodation) => {
    setSelectedAccommodation(accommodation);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submissionData = {
      PackageID: packageID,
      HotelName: selectedAccommodation.HotelName,
      Location: selectedAccommodation.Location,
      CheckInDate: filters.checkInDate,
      CheckOutDate: filters.checkOutDate,
      RoomType: filters.roomType
    };

    try {
      const response = await fetch('http://localhost:3033/accommodations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        console.log('Accommodation saved successfully!');
        navigate(`/transportation/${packageID}`); // Redirect to the transportation page
      } else {
        console.error('Failed to save accommodation');
      }
    } catch (error) {
      console.error('Error submitting accommodation:', error);
    }
  };

  return (
    <div className="accommodations-container">
      <h2>Accommodations for Package {packageID}</h2>

      {/* Filters */}
      <div className="filter-form">
        <label>Check-In Date:</label>
        <input type="date" name="checkInDate" value={filters.checkInDate} onChange={handleInputChange} />

        <label>Check-Out Date:</label>
        <input type="date" name="checkOutDate" value={filters.checkOutDate} onChange={handleInputChange} />

        <label>Room Type:</label>
        <input type="text" name="roomType" placeholder="e.g., Suite, Double" value={filters.roomType} onChange={handleInputChange} />
      </div>

      {/* Accommodation List */}
      <div className="accommodations-list">
        {accommodations.length > 0 ? (
          accommodations.map((accommodation) => (
            <div
              className={`accommodation-box ${selectedAccommodation.HotelName === accommodation.HotelName ? 'selected' : ''}`}
              key={accommodation.AccommodationID}
              onClick={() => handleAccommodationSelection(accommodation)}
            >
              <h3>{accommodation.HotelName}</h3>
              <p><strong>Location:</strong> {accommodation.Location}</p>
              <p><strong>Check-In:</strong> {accommodation.CheckInDate}</p>
              <p><strong>Check-Out:</strong> {accommodation.CheckOutDate}</p>
              <p><strong>Room Type:</strong> {accommodation.RoomType}</p>
            </div>
          ))
        ) : (
          <p>No accommodations available</p>
        )}
      </div>

      {/* Display Selected Accommodation */}
      {selectedAccommodation.HotelName && (
        <div className="selected-accommodation">
          <h4>Selected Accommodation:</h4>
          <p><strong>Hotel Name:</strong> {selectedAccommodation.HotelName}</p>
          <p><strong>Location:</strong> {selectedAccommodation.Location}</p>
        </div>
      )}

      {/* Submit Button */}
      <button onClick={handleSubmit} disabled={!selectedAccommodation.HotelName}>
        Submit Accommodation
      </button>
    </div>
  );
};

export default Accommodations;
