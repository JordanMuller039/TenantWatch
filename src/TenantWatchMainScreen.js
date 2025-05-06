import React, { useState, useEffect, useRef } from 'react';
import './TenantWatchMainScreen.css';
import logo from './images/logoNEW.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { useNhostClient } from '@nhost/react';  
import { useSignOut, useUserAvatarUrl, useUserId, useUserDisplayName } from '@nhost/react';

const SEARCH_COMPLAINTS = gql`
  query SearchComplaints($searchTerm: String!) {
    Complaint(where: {
      _or: [
        { TenantName: { _ilike: $searchTerm } },
        { TenantCompany: { _ilike: $searchTerm } },
        { PropName: { _ilike: $searchTerm } }
      ]
    }) {
      ComplaintID
      TenantName
      TenantBusinessType
      TenantEmail
      PropID
      PropName
      PropAddress
      ComplaintSeverity
      LeaseStart
      LeaseEnd
      TenantCompany
    }
  }
`;

const TenantWatchMainScreen = () => {
  const nhost = useNhostClient();
  const avatarUrl = useUserAvatarUrl();
  const userId = useUserId();
  const displayName = useUserDisplayName();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [showComplaintsPanel, setShowComplaintsPanel] = useState(false);
  const { signOut } = useSignOut();
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const placeholderRef = useRef(null);
  const placeholders = [
    'Search for a Company',
    'Search for a Tenant',
    'Search for an ID',
    'Search for a Company Number',
    'Search for a Director Name',
    'Search for a Trading Name'
  ];

  const { loading, error, data } = useQuery(SEARCH_COMPLAINTS, {
    variables: { searchTerm: `%${searchInput}%` },
    skip: !searchInput,
    onCompleted: () => setShowComplaintsPanel(!!searchInput)
  });

  const menuItems = [
    { path: '/tenantwatch', label: 'Home' },
    { path: '/account', label: 'Account' },
    { path: '/complaints', label: 'Complaints' },
    { path: '/settings', label: 'Settings' },
  ];

  useEffect(() => {
    if (!isSearchFocused && !searchInput) {
      const interval = setInterval(() => {
        setCurrentPlaceholderIndex(prev => (prev + 1) % placeholders.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSearchFocused, searchInput, placeholders.length]);

  return (
    <div className="tenantwatch-container">
      {/* Top Menu Bar */}
      <div className="top-menu-bar">
        <ul>
          {userId && (
            <li className="avatar-item">
              <img 
                src={avatarUrl || '/default-avatar.png'}
                alt="User Avatar" 
                className="avatar-img"
              />
              {displayName && <span className="avatar-name">{displayName}</span>}
            </li>
          )}
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </li>
          ))}
          <li onClick={signOut}>Log Out</li>
        </ul>
      </div>

      <div className={`tenantwatch-content-box ${showComplaintsPanel ? 'shift-left' : ''}`}>
        <img src={logo} alt="Tenant Watch Logo" className="tenantwatch-logo" />
        
        <div className="search-container">
          <input
            className={`search-bar ${isSearchFocused ? 'search-bar-focused' : ''}`}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {!isSearchFocused && !searchInput && (
            <div className="animated-placeholder" ref={placeholderRef}>
              {placeholders[currentPlaceholderIndex]}
            </div>
          )}
        </div>
        
        <button className="file-complaint-button" onClick={() => navigate('/file-complaint')}>
          File Complaint
        </button>
        
        {loading && <p>Loading complaints...</p>}
        {error && <p>Error fetching complaints: {error.message}</p>}
      </div>

      <div className={`complaints-container ${showComplaintsPanel ? 'show' : ''}`}>
        {data?.Complaint?.length > 0 ? (
          data.Complaint.map((complaint) => (
            <div key={complaint.ComplaintID} className="complaint-card">
              <h3>{complaint.TenantCompany}</h3>
              <div className="complaint-details">
                <p><strong>Tenant:</strong> {complaint.TenantName}</p>
                <p><strong>Business Type:</strong> {complaint.TenantBusinessType}</p>
                <p><strong>Severity:</strong> <span className={`severity-${complaint.ComplaintSeverity}`}>{complaint.ComplaintSeverity}</span></p>
                <p><strong>Lease:</strong> {complaint.LeaseStart} - {complaint.LeaseEnd}</p>
                <p><strong>Property:</strong> {complaint.PropName}</p>
                <p><strong>Address:</strong> {complaint.PropAddress}</p>
                <p><strong>Email:</strong> {complaint.TenantEmail}</p>
              </div>
            </div>
          ))
        ) : (
          searchInput && <div className="no-results">No complaints found</div>
        )}
      </div>
    </div>
  );
};

export default TenantWatchMainScreen;