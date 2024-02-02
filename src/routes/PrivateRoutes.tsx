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
        console.log(accessToken);
        if (!accessToken) {
          navigate('/');
          return;
        }

        const isTokenExpired = await AuthApi.isTokenExpired(accessToken);

        if (isTokenExpired) {
          try {
            await AuthApi.refreshToken();
          } catch (refreshError) {
            setError('Error refreshing token');
            navigate('/');
            return;
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
