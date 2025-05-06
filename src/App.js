// Import necessary components and libraries
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Ensure these are imported
import LandingPage from './LandingPage';
import CreateAccount from './CreateAccount';
import TenantWatchMainScreen from './TenantWatchMainScreen';
import FileComplaint from './file-complaint';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NhostClient, NhostProvider } from '@nhost/react';
import Account from './Account';
import ProtectedRoute from './ProtectedRoute';
import OwnerDashboard from './OwnerDashboard';

// Initialize NhostClient and Apollo Client
const nhost = new NhostClient({
  subdomain: 'rhxqagmisemdmtoondjj',
  region: 'eu-west-2',
});

const client = new ApolloClient({
  uri: process.env.REACT_APP_HASURA_URL, // Access from .env
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': process.env.REACT_APP_HASURA_ADMIN_SECRET, // Access from .env
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
      <NhostProvider nhost={nhost}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/create-account" element={<CreateAccount />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/tenantwatch" element={<TenantWatchMainScreen />} />
              <Route path="/Account" element={<Account />} />
              <Route path="/file-complaint" element={<FileComplaint />} />
              <Route path="/OwnerDashboard" element={<OwnerDashboard />} />
            </Route>
          </Routes>
        </Router>
      </NhostProvider>
    </ApolloProvider>
  );
}

export default App;
