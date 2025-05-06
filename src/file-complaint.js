import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNhostClient } from '@nhost/react';
import './file-complaint.css';
import TermsAndConditions from './TermsAndConditions';

const FileComplaint = () => {
  const [sliderValue, setSliderValue] = useState(5);
  const [selectedBreaches, setSelectedBreaches] = useState([]);
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantBusinessType: '',
    tenantEmail: '',
    tenantCompany: '',
    propertyName: '',
    propertyAddress: '',
    leaseStart: '',
    leaseEnd: '',
    rentalunitnumber: ''
  });
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const nhostClient = useNhostClient();
  const [showPoppi, setShowPoppi] = useState(false);

  const handleSliderChange = (e) => {
    setSliderValue(Number(e.target.value));
  };

  const openPoppiModal = () => {
    setShowPoppi(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  const closeTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  useEffect(() => {
    const slider = sliderRef.current;

    if (slider) {
      const updateSliderBackground = () => {
        const value = slider.value;
        const min = slider.min || 1;
        const max = slider.max || 10;
        const percentage = ((value - min) / (max - min)) * 100;

        slider.style.background = `linear-gradient(to right, #7a0a0a ${percentage}%, #ddd ${percentage}%)`;
      };

      slider.addEventListener('input', updateSliderBackground);
      updateSliderBackground();

      return () => {
        slider.removeEventListener('input', updateSliderBackground);
      };
    }
  }, []);

  const materialBreachOptions = [
    "Non-Payment of Rent",
    "Unauthorized Occupants", 
    "Damage to the Property",
    "Illegal Activities",
    "Unauthorized Alterations or Renovations",
    "Violation of Permitted Use Clause", 
    "Failure to Maintain Insurance Coverage",
    "Abandonment or Failure to Operate",
    "Breach of Exclusive Use Agreements",
    "Failure to Adhere to Environmental or Zoning Regulations"
  ];

  const toggleBreachSelection = (breach) => {
    setSelectedBreaches(prevSelected => 
      prevSelected.includes(breach)
        ? prevSelected.filter(b => b !== breach)
        : [...prevSelected, breach]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form data
    const requiredFields = [
      'tenantName', 'tenantBusinessType', 'tenantEmail', 
      'propertyName', 'propertyAddress', 'leaseStart', 'leaseEnd'
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }
  
    if (selectedBreaches.length === 0) {
      alert('Please select at least one material breach');
      return;
    }
  
    try {
      // Direct GraphQL mutation with the exact same structure as your working test
      const mutation = `
        mutation InsertComplaint($complaint: complaint_insert_input!) {
          insert_Complaint_one(object: $complaint) {
            ComplaintID
          }
        }
      `;
      
      // Match the structure of your working test data exactly
      const variables = {
        complaint: {
          TenantName: formData.tenantName,
          TenantBusinessType: formData.tenantBusinessType,
          TenantEmail: formData.tenantEmail,
          PropID: "test1", // Hardcoded to "test1" as requested
          PropName: formData.propertyName,
          PropAddress: formData.propertyAddress,
          ComplaintSeverity: sliderValue,
          LeaseStart: formData.leaseStart,
          LeaseEnd: formData.leaseEnd,
          TenantCompany: formData.tenantCompany || ''
        }
      };
  
      console.log("Request Variables:", variables);
      
      // Execute the mutation
      const response = await nhostClient.graphql.request(mutation, variables);
      
      console.log('GraphQL Response:', response);
      
      if (response.error) {
        console.error('Error inserting complaint:', response.error);
        alert(`Error inserting complaint: ${response.error.message || 'Unknown error'}`);
        throw new Error('Failed to insert complaint');
      }
      
      // Get the ComplaintID from the response
      const complaintId = response.data.insert_complaint_one.ComplaintID;
      
      // Insert each breach
      for (const breach of selectedBreaches) {
        const breachMutation = `
          mutation InsertBreach($breach: materialbreach_insert_input!) {
            insert_materialbreach_one(object: $breach) {
              BreachID
            }
          }
        `;
        
        const breachVariables = {
          breach: {
            ComplaintID: complaintId,
            BreachDescription: breach
          }
        };
        
        const breachResponse = await nhostClient.graphql.request(breachMutation, breachVariables);
        
        if (breachResponse.error) {
          console.error(`Error inserting breach "${breach}":`, breachResponse.error);
          alert(`Error inserting breach: ${breachResponse.error.message}`);
          throw new Error('Failed to insert breach');
        }
      }
      
      alert('Complaint submitted successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert(`Failed to submit complaint: ${error.message}`);
    }
  };

  return (
    <div className="file-complaint-container">
      {/* Back Button */}
      <button 
        className="back-button" 
        onClick={() => navigate(-1)}
      >
        Back
      </button>

      <div className="complaint-form">
        <h2>Create a Complaint</h2>
        <form className="form" onSubmit={handleSubmit}>
          {/* Form Fields */}
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input 
              type="text" 
              name="tenantName"
              placeholder="Tenant's Name" 
              className="input-field" 
              style={{ flex: 1 }}
              value={formData.tenantName}
              onChange={handleInputChange}
              required
            />
            <select 
              name="tenantBusinessType"
              className="input-field" 
              style={{ flex: 1 }}
              value={formData.tenantBusinessType}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Tenant Business Type</option>
              <option value="Retail">Retail</option>
              <option value="Office">Office</option>
              <option value="Residential">Residential</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
            <input 
              type="email" 
              name="tenantEmail"
              placeholder="Tenant Email" 
              className="input-field" 
              style={{ flex: 1 }}
              value={formData.tenantEmail}
              onChange={handleInputChange}
              required
            />
            <input 
              type="text" 
              name="tenantCompany"
              placeholder="Tenant Company Name" 
              className="input-field" 
              style={{ flex: 1 }}
              value={formData.tenantCompany}
              onChange={handleInputChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '10px' }}>
            <input 
              type="text" 
              name="propertyName"
              placeholder="Property Name" 
              className="input-field" 
              style={{ flex: 1 }}
              value={formData.propertyName}
              onChange={handleInputChange}
              required
            />
            <input 
              type="text" 
              name="rentalunitnumber"
              placeholder="Rental Unit Number" 
              className="input-field" 
              style={{ flex: 1 }}
              value={formData.rentalunitnumber}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="propertyAddress"
              placeholder="Address"
              className="input-field"
              style={{ flex: 1 }}
              value={formData.propertyAddress}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="slider-container">
            <label htmlFor="severity-slider">
              Complaint Severity: {sliderValue}
            </label>
            <input
              id="severity-slider"
              type="range"
              min="1"
              max="10"
              value={sliderValue}
              onChange={handleSliderChange}
              className="severity-slider"
              ref={sliderRef}
            />
          </div>

          <div className="material-breach-block">
            <h3>Details Of Breach of Lease</h3>
            <div className="breach-chip-group">
              {materialBreachOptions.map((breach) => (
                <div
                  key={breach}
                  className={`breach-chip ${selectedBreaches.includes(breach) ? 'selected' : ''}`}
                  onClick={() => toggleBreachSelection(breach)}
                >
                  {breach}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <label className="date-label" htmlFor="lease-start">Lease Start Date</label>
              <input 
                type="date" 
                id="lease-start" 
                name="leaseStart"
                className="input-field" 
                value={formData.leaseStart}
                onChange={handleInputChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="date-label" htmlFor="lease-end">Lease End Date</label>
              <input 
                type="date" 
                id="lease-end" 
                name="leaseEnd"
                className="input-field" 
                value={formData.leaseEnd}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* POPPI Checkbox */}
          <div className="poppi-container">
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="poppi"
                required
                className="checkbox-input"
              />
              <label htmlFor="poppi" className="checkbox-label">
                I Accept the POPPI Act Rules{' '}
                <span 
                  className="poppi-link"
                  onClick={openPoppiModal}
                >
                  Read POPPI Act
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="file-complaint-button">Submit Complaint</button>
        </form>
      </div>

      {/* POPPI Modal */}
      {showPoppi && (
        <div className="poppi-popup">
          <div className="poppi-content">
            <h3>POPPI Act Agreement</h3>
            <p>Welcome to our service. By signing up, you agree to the following terms:</p>
            <ul>
              <li>You must provide accurate and complete registration information.</li>
              <li>Your account is personal and should not be shared with others.</li>
              <li>We reserve the right to suspend or terminate accounts that violate our policies.</li>
              <li>Your data may be used to improve our services but will never be sold to third parties.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>Any misuse of the platform may result in legal action.</li>
            </ul>
            <p>For more details, please contact our support team.</p>
            <button onClick={() => setShowPoppi(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileComplaint;