import React, { createContext, useContext, useState } from 'react';

// Create UserContext
const UserContext = createContext();

// Custom hook to use UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component to wrap the app and provide context values
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Ensure user state is initialized

  // Optionally, you could add methods to update user state or fetch it from an API
  // const login = (userData) => setUser(userData);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};
