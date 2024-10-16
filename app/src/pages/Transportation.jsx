import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './transportation.css';

const Transportation = () => {
  const { packageID } = useParams();
  const [transportData, setTransportData] = useState({
    transportType: '',
    company: '',
    departureDate: '',
    returnDate: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        setIsSubmitted(true);
      } else {
        console.error('Failed to save transportation');
      }
    } catch (error) {
      console.error('Error submitting transportation:', error);
    }
  };

  return (
    <div className="transportation-container">
      <h2>Transportation Details for Package {packageID}</h2>

      <form onSubmit={handleSubmit} className="transportation-form">
        <div className="form-group">
          <label>Transport Type:</label>
          <select 
            name="transportType" 
            value={transportData.transportType} 
            onChange={handleInputChange}
            required
          >
            <option value="">Select Transport Type</option>
            <option value="flight">Flight</option>
            <option value="bus">Bus</option>
            <option value="car">Car</option>
          </select>
        </div>

        {transportData.transportType && (
          <div className="form-group">
            <label>Company:</label>
            <select 
              name="company" 
              value={transportData.company} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select Company</option>
              {companyOptions[transportData.transportType]?.map((company, index) => (
                <option key={index} value={company}>{company}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Departure Date:</label>
          <input 
            type="date" 
            name="departureDate" 
            value={transportData.departureDate} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Return Date:</label>
          <input 
            type="date" 
            name="returnDate" 
            value={transportData.returnDate} 
            onChange={handleInputChange} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitted}
        >
          {isSubmitted ? 'Submitted' : 'Submit Transportation'}
        </button>
      </form>

      {isSubmitted && (
        <div className="navigation-arrow">
          <Link to={`/booking`}>
            <ArrowRight size={24} />
            <span>Go to Booking</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Transportation;