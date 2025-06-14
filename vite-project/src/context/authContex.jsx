import React, { createContext, useState, useEffect, useContext } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const port = import.meta.env.VITE_SERVER_URL;

  const checkAuth = async () => {

  // only works for non-HttpOnly cookies method:
  // const cookies = document.cookie;
  // const tokenExists = cookies.includes('token=');
  // setIsAuthenticated(tokenExists);
  
  // HttpOnly method :- Ask backend: "Is the user authenticated?"
    try {
      const res = await fetch(`${port}/api/auth/verify`, {
        credentials: 'include',
      });
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Error verifying auth:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth(); // gets called when the app first loads
  }, []);

  const getUserId = async () => {

      try {
        const res = await fetch(`${port}/api/auth/getuserid`, {
          credentials: 'include',
        });
        const data = await res.json();
        // console.log('user id:', data._id);
        return data._id;

      } catch (error) {
        console.error('Error fetching user id:', error);
      }
    }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuth, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
