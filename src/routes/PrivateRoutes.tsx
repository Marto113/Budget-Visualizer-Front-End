import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../services/authApi';

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = AuthApi.getAccessToken();
        const refreshToken = AuthApi.getRefreshToken();

        if (!accessToken && !refreshToken) {
          navigate('/login');
          return;
        }

        if (refreshToken && !accessToken) {
          try {
            const renewToken = await AuthApi.refreshToken();
            const decodedToken = AuthApi.decodeToken(renewToken);
            console.log(decodedToken);
      
            if (decodedToken && decodedToken.userId) {
              const userId = decodedToken.userId;
              navigate(`/dashboard/${userId}`);
            } else {
              console.error("User ID not available in the token");
            }
          } catch (error) {
            console.error("Error decoding token or extracting user ID:", error);
          }
          
          
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setError('Error checking authentication');
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <>{element}</>;
};

export default PrivateRoute;
