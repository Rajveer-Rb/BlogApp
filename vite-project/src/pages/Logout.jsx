import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContex';

function Logout() {

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {

    const handleLogout = async () => {

      try {
        const response = await fetch('http://localhost:3000/user/logout', {
          method: 'POST',
          credentials: 'include',
        });

        const data = await response.json();
        // console.log(data);

        if (response.ok) {
          // console.log('Logout successful');
          setIsAuthenticated(false); // update global auth state
          navigate('/user/login');
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };

    handleLogout();
  }, []);

  return <></>; // or return a loading message
}

export default Logout;
