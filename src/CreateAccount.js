import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNhostClient, useUserId } from '@nhost/react';
import './CreateAccount.css';
import CreateAccountIcon from './images/account.png';

const CreateAccount = () => {
  const nhost = useNhostClient();
  const navigate = useNavigate();
  //const userId = useUserId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tradingName, setTradingName] = useState('');
  const [directorName, setDirectorName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [companyNumber, setCompanyNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const PopupComponent = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
  }

  const handleSignUp = async () => {
    setIsSubmitting(true);
    setError('');
  
    try {
      // Sign up the user
     const signUpResult = await nhost.auth.signUp({
        email,
        password,
        options: {
          metadata: {
            avatarUrl: "DefaultAvatar.png",
            companyName,
            tradingName,
            directorName,
            idNumber,
            companyNumber
          }
        }
      });
      
  
      // Directly insert user into All_Users table
      const insertUserMutation = `
        mutation InsertUser($email: String!) {
          insert_Base_one(object: { 
            UserEmail: $email,
            UserRole: "owner"
          }) {
            UserEmail
          }
        }
      `;
  
      const { data: userData, error: insertError } = await nhost.graphql.request(insertUserMutation, { email });
  


      //const userID = userData.insert_All_Users_one.UserID;
      // Insert into Owner table with retrieved UserID
     /* const insertOwnerMutation = `
      mutation InsertOwner($userID: uuid!, $ownerName: String!, $ownerCompany: String!, $ownerIDNumber: String!, $ownerCompanyNumber: String!, $tradingName: String!) {
        insert_owner_one(object: {  # Changed from insert_Owner_one to insert_owner_one
          UserID: $userID,
          OwnerName: $ownerName,
          OwnerCompany: $ownerCompany,
          OwnerIDNumber: $ownerIDNumber,
          OwnerCompanyNumber: $ownerCompanyNumber,
          TradingName: $tradingName
        }) {
          OwnerID
        }
      }
    `;
    
  const { error: insertOwnerError } = await nhost.graphql.request(insertOwnerMutation, {
    userID,
    ownerName: directorName,
    ownerCompany: companyName,
    ownerIDNumber: idNumber,
    ownerCompanyNumber: companyNumber,
    tradingName
  });

  if (insertOwnerError) {
    console.error('Error inserting into Owner table:', insertOwnerError);
    setError('Failed to create owner profile.');
    return;
  }
    */

  
      alert('Check your email to verify your account!');
      navigate('/');
    } catch (err) {
      console.error('Sign up error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  

  return (
    <div className="create-account-container">
      <button 
        className="back-button" 
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <div className="create-account-content-box">
        <img src={CreateAccountIcon} alt="Tenant Watch Logo" className="account-image" />
        <h2>Create Account</h2>
        <input
          type="email"
          className="create-account-email-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          className="create-account-email-input"
          placeholder="Name of Company/Trust"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <input
          type="text"
          className="create-account-email-input"
          placeholder="Trading Name"
          value={tradingName}
          onChange={(e) => setTradingName(e.target.value)}
          required
        />
        <input
          type="text"
          className="create-account-email-input"
          placeholder="Director/Trustee Name"
          value={directorName}
          onChange={(e) => setDirectorName(e.target.value)}
          required
        />
        <input
          type="text"
          className="create-account-email-input"
          placeholder="ID Number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          required
        />
        <input
          type="text"
          className="create-account-email-input"
          placeholder="Company/Trust Number"
          value={companyNumber}
          onChange={(e) => setCompanyNumber(e.target.value)}
          required
        />
        <input
          type="password"
          className="create-account-password-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="terms-container">
          <input type="checkbox" id="termsCheckbox" className="circular-checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
          <label htmlFor="termsCheckbox">
            I Agree to the <span className="terms-link" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTerms(true); }}> Terms and Services </span>
          </label>
        </div>

        {error && <p className="popup error">{error}</p>}
        <button
          className="login-button"
          onClick={handleSignUp}
          disabled={
            isSubmitting ||
            !email ||
            !password ||
            !companyName ||
            !tradingName ||
            !directorName ||
            !idNumber ||
            !companyNumber ||
            !isChecked
          }
        >
          {isSubmitting ? 'Creating Account...' : 'Sign Up'}
        </button>
      </div>

      {showTerms && (
        <div className="terms-popup">
          <div className="terms-content">
            <h3>Terms and Services</h3>
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
            <button onClick={() => setShowTerms(false)}>Close</button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default CreateAccount;
