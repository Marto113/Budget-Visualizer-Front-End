import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApi from '../services/authApi';

const InitialPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccessToken = async () => {
            const accessToken = AuthApi.getAccessToken();
            const refreshToken = AuthApi.getRefreshToken();

            if (accessToken) {
                try {
                    const decodedToken = AuthApi.decodeToken(accessToken);

                    if (decodedToken && decodedToken.userId) {
                        const userId = decodedToken.userId;
                        navigate(`/dashboard/${userId}`);
                    } else {
                        console.error('User ID not available in the token');
                    }
                } catch (error) {
                    console.error('Error decoding token or extracting user ID:', error);
                }
            } else if (refreshToken){
                const renwedToken = await AuthApi.refreshToken();

                const decodedToken = AuthApi.decodeToken(renwedToken);

                if (decodedToken && decodedToken.userId) {
                    const userId = decodedToken.userId;
                    navigate(`/dashboard/${userId}`);
                } else {
                    navigate('/login');
                }
            }
        };

        checkAccessToken();
        navigate('/login');
        
    }, [navigate]);

    return <div>Redirecting...</div>;
};

export default InitialPage;
