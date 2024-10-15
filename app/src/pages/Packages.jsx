import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate between pages
import './packages.css'; // Optional: For styling the boxes

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching the packages from the API
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://localhost:3033/packages'); // Replace with your API endpoint
        const data = await response.json();
        setPackages(data); // Assuming the API returns an array of packages
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handlePackageClick = (packageID) => {
    // Navigate to the Accommodations page with the selected packageID
    navigate(`/accommodations/${packageID}`);
  };

  return (
    <div className="packages-container">
      {packages.length > 0 ? (
        packages.map((pkg) => (
          <div
            className="package-box"
            key={pkg.PackageID}
            onClick={() => handlePackageClick(pkg.PackageID)}
          >
            <h3>{pkg.PackageName}</h3>
            <p><strong>Destination:</strong> {pkg.Destination}</p>
            <p><strong>Duration:</strong> {pkg.Duration} days</p>
            <p><strong>Cost:</strong> ${pkg.Cost}</p>
            <p><strong>Details:</strong> {pkg.Details}</p>
            <p><strong>Category:</strong> {pkg.Category}</p>
          </div>
        ))
      ) : (
        <p>No packages available</p>
      )}
    </div>
  );
};

export default Packages;
