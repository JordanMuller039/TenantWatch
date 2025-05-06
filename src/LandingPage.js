import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticationStatus, useSignInEmailPassword, useSignOut } from '@nhost/react';
import './LandingPage.css';
import logo from './images/logoNEW.png';
import eyeClosed from './images/eye-closed.png';
import eyeOpen from './images/eye-open.png';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signInEmailPassword } = useSignInEmailPassword();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthenticationStatus();
  const navigate = useNavigate();
  const { signOut } = useSignOut();

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
      setIsLoggingIn(true);

      const { error: signInError } = await signInEmailPassword(email, password);

      if (signInError) {
        console.error('❌ Login failed:', signInError);
        setError(signInError.message);
      } else {
        // Redirect all authenticated users to OwnerDashboard
        navigate('/OwnerDashboard', { replace: true });
      }
    } catch (error) {
      console.error('❌ Unexpected error during login:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      navigate('/OwnerDashboard', { replace: true });
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

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
            disabled={isLoggingIn || isAuthLoading}
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