import React, { useState } from 'react';
import './OwnerDashboard.css';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from './images/logoNEW.png';

const OwnerDashboard = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState('managers');

  // Navigation function
  const handleNavigation = (path) => {
    // If using React Router:
    navigate(path);
    // Or for window navigation:
    // window.location.href = path;
  };

  // Sign out function
  const handleSignOut = () => {
    // Replace with your actual sign out logic
    // For example:
    // signOut();
    console.log('Signing out...');
  };

  const navigate = useNavigate();

  // Mock user data - replace with actual authentication if available
  const userData = {
    email: 'user@example.com',
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

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Functions for the new buttons
  const handleManagePermissions = (managerName) => {
    console.log(`Managing permissions for ${managerName}`);
    // Add your permission management logic here
  };

  const handleDeleteManager = (managerName) => {
    console.log(`Deleting manager ${managerName}`);
    // Add your delete manager logic here
  };

  return (
    <div className="dashboard-container">
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
              {userData.email && <span className="avatar-name">{userData.email}</span>}
            </li>
          )}
          <li
            className={window.location.pathname === '/tenantwatch' ? 'active' : ''}
            onClick={() => handleNavigation('/tenantwatch')}
          >
            Home
          </li>
          <li onClick={handleSignOut}>Log Out</li>
        </ul>
      </div>
      <div className="dashboard-content-box">
      <img 
          src={logo} 
          alt="Tenant Watch Logo" 
          style={{
            width: '300px', 
            height: 'auto', 
            display: 'block', 
            margin: '0 auto', 
            objectFit: 'contain',
            top: '10px'
          }} 
        />

        <h2 className="title">Property Owner Dashboard</h2>
        
        <div className="company-section">
          <h4>Green Property Management</h4>
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
        <div className="tab-content">
          {/* Managers Tab */}
          <div className={`tab-panel ${activeTab === 'managers' ? 'active' : ''}`}>
            <h3 className="subheading">Your Managers</h3>
            <button className="add-button">Invite a Manager</button>
            <div className="managers-container">
              {managers.map((manager, index) => (
                <div key={index} className="manager-card">
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
          
          {/* Properties Tab */}
          <div className={`tab-panel ${activeTab === 'properties' ? 'active' : ''}`}>
            <h3 className="subheading">Your Properties</h3>
            <button className="add-button">Add Property</button>
            <div className="properties-container">
              {properties.map((property, index) => (
                <div key={index} className="property-card">
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
          
          {/* Complaints Tab */}
          <div className={`tab-panel ${activeTab === 'complaints' ? 'active' : ''}`}>
            <h3 className="subheading">Recent Complaints</h3>
            <div className="complaints-container">
              {complaints.map((complaint, index) => (
                <div key={index} className="complaint-card">
                  <h3>{complaint.subject}</h3>
                  <p><span>Property:</span> {complaint.property}</p>
                  <p><span>Unit:</span> {complaint.unit}</p>
                  <p><span>Date:</span> {complaint.date}</p>
                  <p><span>Status:</span> 
                    <span style={{ 
                      color: complaint.status === 'Open' ? '#e74c3c' : 
                             complaint.status === 'In Progress' ? '#f39c12' : '#27ae60'
                    }}>
                      {" " + complaint.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Admin Tab */}
          <div className={`tab-panel ${activeTab === 'admin' ? 'active' : ''}`}>
            <h3 className="subheading">Administration</h3>
            <div className="admin-container">
              <div className="manager-card">
                <h3>Account Settings</h3>
                <p>Manage your account preferences, notifications, and security settings</p>
              </div>
              <div className="manager-card">
                <h3>Billing Information</h3>
                <p>Manage payment methods, view invoices, and update billing details</p>
              </div>
              <div className="manager-card">
                <h3>User Permissions</h3>
                <p>Configure access levels and permissions for your team members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;