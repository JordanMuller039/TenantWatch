import React, { useState } from 'react';
import './OwnerDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from '@nhost/react'; 
import logo from './images/logoNEW.png';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('managers');
  const navigate = useNavigate();
  const { signOut } = useSignOut();

  // Mock user data
  const userData = {
    email: 'owner@example.com',
    avatarUrl: './images/user-avatar.jpg',
    userId: '123456'
  };

  // Sample Data
  const managers = [
    { name: 'John Doe', email: 'john.doe@company.com', role: 'Property Manager' },
    { name: 'Jane Smith', email: 'jane.smith@company.com', role: 'Assistant Manager' },
    { name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'Maintenance Manager' },
  ];

  const properties = [
    { 
      name: 'Lakeview Apartments', 
      address: '123 Lakeside Rd', 
      units: 24, 
      occupancyRate: '92%' 
    },
    { 
      name: 'Mountain Ridge Villas', 
      address: '456 Mountain St', 
      units: 18, 
      occupancyRate: '88%' 
    },
    { 
      name: 'Greenfield Towers', 
      address: '789 Green St', 
      units: 32, 
      occupancyRate: '95%' 
    },
  ];

  const complaints = [
    { 
      subject: 'Water Leak', 
      property: 'Lakeview Apartments', 
      unit: '12B', 
      date: '2025-03-10', 
      status: 'Open' 
    },
    { 
      subject: 'Heating Issue', 
      property: 'Mountain Ridge Villas', 
      unit: '5A', 
      date: '2025-03-12', 
      status: 'In Progress' 
    },
    { 
      subject: 'Noise Complaint', 
      property: 'Greenfield Towers', 
      unit: '21C', 
      date: '2025-03-08', 
      status: 'Resolved' 
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSignOut = async () => {
    try {
      // Sign out the user
      await signOut();
      // Redirect to landing page after successful sign out
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleManagePermissions = (managerName) => {
    console.log(`Managing permissions for ${managerName}`);
  };

  const handleDeleteManager = (managerName) => {
    console.log(`Deleting manager ${managerName}`);
  };

  return (
    <div className="dashboard-app-container">
      {/* Top Menu Bar */}
      <div className="top-menu-bar">
        <ul>
          {userData.userId && (
            <li className="avatar-item">
              <img 
                src={userData.avatarUrl || '/default-avatar.png'}
                alt="User Avatar" 
                className="avatar-img"
              />
              <span className="avatar-name">{userData.email}</span>
            </li>
          )}
          <li onClick={() => navigate('/tenantwatch')}>Home</li>
          <li onClick={() => navigate('/OwnerDashboard')}>Dashboard</li>
          <li onClick={handleSignOut}>Log Out</li>
        </ul>
      </div>

      <div className="dashboard-content-container">
        <div className="dashboard-header">
          <img src={logo} alt="Tenant Watch Logo" className="dashboard-logo" />
          <h2 className="dashboard-title">Property Owner Dashboard</h2>
          <div className="company-section">
            <h4>Green Property Management</h4>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'managers' ? 'active' : ''}`}
            onClick={() => handleTabChange('managers')}
          >
            Managers
          </button>
          <button 
            className={`tab-button ${activeTab === 'properties' ? 'active' : ''}`}
            onClick={() => handleTabChange('properties')}
          >
            Properties
          </button>
          <button 
            className={`tab-button ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => handleTabChange('complaints')}
          >
            Complaints
          </button>
          <button 
            className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleTabChange('admin')}
          >
            Admin
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="tab-content-container">
          {/* Managers Tab */}
          {activeTab === 'managers' && (
            <div className="tab-content">
              <h3 className="subheading">Your Managers</h3>
              <button className="add-button">Invite a Manager</button>
              <div className="cards-container">
                {managers.map((manager, index) => (
                  <div key={index} className="card">
                    <h3>{manager.name}</h3>
                    <p>Email: {manager.email}</p>
                    <p>Role: {manager.role}</p>
                    <div className="manager-actions">
                      <button 
                        className="permissions-button"
                        onClick={() => handleManagePermissions(manager.name)}
                      >
                        Permissions
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteManager(manager.name)}
                      >
                        <i className="bin-icon">🗑️</i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Properties Tab */}
          {activeTab === 'properties' && (
            <div className="tab-content">
              <h3 className="subheading">Your Properties</h3>
              <button className="add-button">Add Property</button>
              <div className="cards-container">
                {properties.map((property, index) => (
                  <div key={index} className="card">
                    <h3>{property.name}</h3>
                    <div className="property-details">
                      <p><span>Address:</span> {property.address}</p>
                      <p><span>Units:</span> {property.units}</p>
                      <p><span>Occupancy Rate:</span> {property.occupancyRate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="tab-content">
              <h3 className="subheading">Recent Complaints</h3>
              <div className="cards-container">
                {complaints.map((complaint, index) => (
                  <div key={index} className="card">
                    <h3>{complaint.subject}</h3>
                    <p><span>Property:</span> {complaint.property}</p>
                    <p><span>Unit:</span> {complaint.unit}</p>
                    <p><span>Date:</span> {complaint.date}</p>
                    <p><span>Status:</span> 
                      <span className={`status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                        {" " + complaint.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Admin Tab */}
          {activeTab === 'admin' && (
            <div className="tab-content">
              <h3 className="subheading">Administration</h3>
              <div className="cards-container">
                <div className="card">
                  <h3>Account Settings</h3>
                  <p>Manage your account preferences, notifications, and security settings</p>
                </div>
                <div className="card">
                  <h3>Billing Information</h3>
                  <p>Manage payment methods, view invoices, and update billing details</p>
                </div>
                <div className="card">
                  <h3>User Permissions</h3>
                  <p>Configure access levels and permissions for your team members</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;