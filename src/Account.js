import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserEmail, useUserAvatarUrl, useNhostClient, useFileUpload, useUserData } from '@nhost/react'; 


const Account = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [propertyName, setPropertyName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [erfNumber, setErfNumber] = useState('');
  const [parkingBays, setParkingBays] = useState('');
  const [properties, setProperties] = useState([]);

  const userData = useUserData();
  const nhost = useNhostClient();
  const userEmail = useUserEmail();
  const avatarUrl = useUserAvatarUrl();
  const { upload } = useFileUpload();
  const [uploading, setUploading] = useState(false);
  const [showChangeOption, setShowChangeOption] = useState(false);
  const fileInputRef = useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Generate unique filename with user ID and timestamp
      const fileName = `avatars/${userData?.id}_${Date.now()}_${file.name}`;
      
      // Upload directly to storage without bucket specification
      const { fileMetadata, error: uploadError } = await upload({
        file,
        name: fileName // Organized path
      });

      if (uploadError) throw uploadError;

      // Get public URL using NHost's built-in method
      const fileUrl = nhost.storage.getPublicUrl({ fileId: fileMetadata.id });

      // Update user metadata
      const { error } = await nhost.auth.updateUser({
        metadata: {
          ...(userData?.metadata || {}),
          avatarUrl: fileUrl
        }
      });

      if (error) throw error;

      alert('Avatar updated successfully!');
      fileInputRef.current.value = ''; // Reset input

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Avatar update failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProperty = () => {
    // Logic to add property to state (mocked here)
    const newProperty = {
      name: propertyName,
      address: propertyAddress,
      erfNumber,
      parkingBays,
    };
    setProperties([...properties, newProperty]);
    setIsModalOpen(false); // Close modal after adding property
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Close the modal without adding property
  };

  const handlePropertyClick = (property) => {
    alert(`Details for property: ${property.name}\nAddress: ${property.address}\nERF Number: ${property.erfNumber}\nParking Bays: ${property.parkingBays}`);
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => navigate('/tenantwatch')}>Back</button>
      <div className="content-box">
        <h1>Account</h1>

        {/* Display user email if logged in */}
        {userEmail && (
          <p className="user-email">
            Logged in as: <em>{userEmail}</em>
          </p>
        )}

        {/* Request Password Reset Section */}
        <section>
          <button className="file-complaint-button">Request Password Reset</button>
        </section>

        {/* Add Property Button */}
        <button className="file-complaint-button" onClick={() => setIsModalOpen(true)}>
          Add Property
        </button>

        {/* Your Properties Section */}
        <section className="properties-section">
          <h2>Your Properties</h2>
          {properties.length > 0 ? (
            <div className="properties-container">
              {properties.map((property, index) => (
                <div
                  key={index}
                  className="property-card"
                  onClick={() => handlePropertyClick(property)}
                >
                  <h3>{property.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <p>No properties added yet.</p>
          )}
        </section>

        {/* Modal for Adding Property */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add Property</h2>
              {userEmail && (
                <p className="user-email">
                  Logged in as: <em>{userEmail}</em>
                </p>
              )}
              <label>Property Name:</label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="search-bar"
              />
              <label>Address:</label>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="search-bar"
              />
              <label>ERF Number:</label>
              <input
                type="text"
                value={erfNumber}
                onChange={(e) => setErfNumber(e.target.value)}
                className="search-bar"
              />
              <label>Parking Bays:</label>
              <input
                type="number"
                value={parkingBays}
                onChange={(e) => setParkingBays(e.target.value)}
                className="search-bar"
              />
              <button onClick={handleAddProperty}>Add</button>
              <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
