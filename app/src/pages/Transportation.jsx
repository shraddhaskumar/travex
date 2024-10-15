import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './transportation.css'; // Optional: For styling

const Transportation = () => {
  const { packageID } = useParams(); // Get the PackageID from the URL
  const [transportData, setTransportData] = useState({
    transportType: '',
    company: '',
    departureDate: '',
    returnDate: ''
  });

  // Sample company data based on transport type
  const companyOptions = {
    flight: ['Air India', 'Delta Airlines', 'Emirates'],
    bus: ['Greyhound', 'Megabus', 'FlixBus'],
    car: ['Hertz', 'Enterprise', 'Avis']
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransportData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const submissionData = {
      PackageID: packageID,
      TransportType: transportData.transportType,
      Company: transportData.company,
      DepartureDate: transportData.departureDate,
      ReturnDate: transportData.returnDate
    };

    try {
      const response = await fetch('http://localhost:3033/transportation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        console.log('Transportation saved successfully!');
      } else {
        console.error('Failed to save transportation');
      }
    } catch (error) {
      console.error('Error submitting transportation:', error);
    }
  };

  return (
    <div className="transportation-container">
      <h2>Submit Transportation Details for Package {packageID}</h2>

      <form onSubmit={handleSubmit}>
        <label>Transport Type:</label>
        <select name="transportType" value={transportData.transportType} onChange={handleInputChange}>
          <option value="">Select Transport Type</option>
          <option value="flight">Flight</option>
          <option value="bus">Bus</option>
          <option value="car">Car</option>
        </select>

        {/* Company dropdown will be populated based on the selected transport type */}
        {transportData.transportType && (
          <>
            <label>Company:</label>
            <select name="company" value={transportData.company} onChange={handleInputChange}>
              <option value="">Select Company</option>
              {companyOptions[transportData.transportType]?.map((company, index) => (
                <option key={index} value={company}>{company}</option>
              ))}
            </select>
          </>
        )}

        <label>Departure Date:</label>
        <input type="date" name="departureDate" value={transportData.departureDate} onChange={handleInputChange} required />

        <label>Return Date:</label>
        <input type="date" name="returnDate" value={transportData.returnDate} onChange={handleInputChange} required />

        <button type="submit">Submit Transportation</button>
      </form>
    </div>
  );
};

export default Transportation;