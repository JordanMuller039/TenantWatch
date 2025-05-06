import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthenticationStatus } from '@nhost/react';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthenticationStatus();
  const location = useLocation();

  // If not authenticated, redirect to the landing page
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to landing page');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes using Outlet
  console.log('User authenticated, rendering protected content');
  return <Outlet />;
};

export default ProtectedRoute;