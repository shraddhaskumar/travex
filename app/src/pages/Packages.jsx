import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './packages.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:3033/packages');
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handlePackageClick = (packageID) => {
    navigate(`/accommodations/${packageID}`);
  };

  return (
    <div className="packages-container">
      <h1 className="packages-title">Travel Packages</h1>
      <div className="packages-grid">
        {packages.map((pkg) => (
          <div
            key={pkg.PackageID}
            className="package-box"
            onClick={() => handlePackageClick(pkg.PackageID)}
          >
            <img src={pkg.ImageURL} alt={pkg.PackageName} className="package-image" />
            <div className="package-info">
              <h3 className="package-name">{pkg.PackageName}</h3>
              <p className="package-destination">{pkg.Destination}</p>
              <p className="package-duration">{pkg.Duration} days</p>
              <p className="package-cost">${pkg.Cost}</p>
            </div>
            <div className="package-overlay">
              <h4>Details:</h4>
              <p>{pkg.Details}</p>
              <h4>Category:</h4>
              <p>{pkg.Category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;