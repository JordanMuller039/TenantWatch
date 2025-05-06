import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticationStatus, useSignInEmailPassword, useSignOut } from '@nhost/react';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import './LandingPage.css';
import logo from './images/logoNEW.png';
import eyeClosed from './images/eye-closed.png';
import eyeOpen from './images/eye-open.png';

// GraphQL query to check if an email exists in the Owners table
const CHECK_OWNER_EMAIL = gql`
  query CheckOwnerEmail($email: String!) {
    Owners(where: { OwnerEmail: { _eq: $email } }) {
      OwnerEmail
    }
  }
`;

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state to control button text
  const { signInEmailPassword } = useSignInEmailPassword();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthenticationStatus();
  const navigate = useNavigate();
  const { signOut } = useSignOut();

  // Query the database to check if the email exists in Owners
  const { data, loading } = useQuery(CHECK_OWNER_EMAIL, {
    variables: { email },
    skip: !email, // Skip the query if email is empty
  });

  // Check authentication status and redirect accordingly
  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      console.log('✅ User authenticated - checking role');
      if (data?.Owners.length > 0) {
        navigate('/OwnerDashboard', { replace: true });
      } else {
        navigate('/tenantwatch', { replace: true });
      }
    }
  }, [isAuthenticated, isAuthLoading, navigate, data]);

  const handleForceSignOut = async () => {
    await signOut();
    navigate('/');
    console.log('Force signed out');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('🚀 Login initiated');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setError('');
      setIsLoggingIn(true); // Set loading state when login starts

      const { error: signInError } = await signInEmailPassword(email, password);

      if (signInError) {
        console.error('❌ Login failed:', signInError);
        setError(signInError.message);
      } else {
        console.log('✅ Login successful');
        // The useEffect will handle redirection once authentication state updates
      }
    } catch (error) {
      console.error('❌ Unexpected error during login:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false); // Reset loading state when login is finished
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="content-box">
        <img src={logo} alt="Tenant Watch Logo" className="logo" />
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input
              className="email-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-container password-container">
            <input
              className="password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              alt="Toggle password visibility"
              className="eye-icon"
              onClick={togglePasswordVisibility}
            />
          </div>

          {error && <p className="popup error">{error}</p>}

          <button
            type="submit"
            className="login-button"
            disabled={isLoggingIn || isAuthLoading || loading}
          >
            {isLoggingIn ? (
              <div className="button-loading-state">
                <span>Logging In...</span>
                <span className="spinner"></span>
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <p className="hyperlink">
          <a href="/create-account">Sign-Up</a>
        </p>
        {isAuthenticated && (
          <button 
            className="force-signout-button"
            onClick={handleForceSignOut}
          >
            [DEBUG] Force Sign Out
          </button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
