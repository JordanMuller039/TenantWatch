// Updated App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import CreateAccount from './CreateAccount';
import TenantWatchMainScreen from './TenantWatchMainScreen';
import FileComplaint from './file-complaint';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { NhostClient, NhostProvider } from '@nhost/react';
import Account from './Account';
import ProtectedRoute from './ProtectedRoute';
import OwnerDashboard from './OwnerDashboard';

const nhost = new NhostClient({
  subdomain: 'mtxlfigknetlzoaylfnm',
  region: 'eu-west-2',
});

const client = new ApolloClient({
  uri: 'https://mtxlfigknetlzoaylfnm.hasura.eu-west-2.nhost.run/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-admin-secret': "-FHha1ImcTrMw*5lI(a!:%qE*29N&mI+",
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