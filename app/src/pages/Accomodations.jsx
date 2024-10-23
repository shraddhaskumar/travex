import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './accomodations.css';

const Accommodations = () => {
  const { packageID } = useParams();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [filters, setFilters] = useState({
    checkInDate: '',
    checkOutDate: '',
    roomType: ''
  });
  const [selectedHotel, setSelectedHotel] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [accommodationId, setAccommodationId] = useState(null);
  const [message, setMessage] = useState(''); // New state for the success message

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`http://localhost:3033/locations/${packageID}`);
        const data = await response.json();
        setLocations(data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, [packageID]);

  const handleLocationChange = (event) => {
    const selectedLocation = event.target.value;
    setSelectedLocation(selectedLocation);
    fetchHotels(selectedLocation);
  };

  const fetchHotels = async (location) => {
    try {
      const response = await fetch(`http://localhost:3033/hotels/${location}`);
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submissionData = {
      PackageID: packageID,
      HotelName: selectedHotel,
      Location: selectedLocation,
      CheckInDate: filters.checkInDate,
      CheckOutDate: filters.checkOutDate,
      RoomType: filters.roomType
    };

    try {
      const url = isSubmitted
        ? `http://localhost:3033/accommodations/${accommodationId}`
        : 'http://localhost:3033/accommodations';
      const method = isSubmitted ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(isSubmitted ? 'Accommodation updated successfully!' : 'Accommodation saved successfully!');
        setIsSubmitted(true);
        setAccommodationId(data.accommodationID);

        // Display success message
        setMessage(isSubmitted ? 'Details changed successfully!' : 'Accommodation saved successfully!');

        // Clear message after a few seconds
        setTimeout(() => {
          setMessage('');
        }, 3000); // 3 seconds delay before message disappears
      } else {
        console.error(isSubmitted ? 'Failed to update accommodation' : 'Failed to save accommodation');
      }
    } catch (error) {
      console.error('Error submitting accommodation:', error);
    }
  };

  return (
    <div className="accommodations-container">
      <h2>Accommodations for Package {packageID}</h2>

      <div className="filter-form">
        <div className="form-group">
          <label>Location:</label>
          <select value={selectedLocation} onChange={handleLocationChange}>
            <option value="">Select a Location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.name}>{location.name}</option>
            ))}
          </select>
        </div>

        {selectedLocation && (
          <div className="form-group">
            <label>Select Hotel:</label>
            <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)}>
              <option value="">Select a Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.name}>{hotel.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Check-In Date:</label>
          <input
            type="date"
            name="checkInDate"
            value={filters.checkInDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Check-Out Date:</label>
          <input
            type="date"
            name="checkOutDate"
            value={filters.checkOutDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Room Type:</label>
          <select
            name="roomType"
            value={filters.roomType}
            onChange={handleInputChange}
          >
            <option value="">Select Room Type</option>
            <option value="Suite">Suite</option>
            <option value="Double">Double</option>
            <option value="Single">Single</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedHotel || !filters.checkInDate || !filters.checkOutDate || !filters.roomType}
      >
        {isSubmitted ? 'Change Details' : 'Submit Accommodation'}
      </button>

      {message && (
        <p className="success-message">{message}</p> // Display message here
      )}

      {isSubmitted && (
        <div className="navigation-arrow">
          <Link to={`/transportation/${packageID}`}>
            <ArrowRight size={24} />
            <span>Go to Transportation</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Accommodations;
