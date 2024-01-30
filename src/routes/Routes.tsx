import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AuthApi from '../services/authApi';

function isTokenExpired() {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());

  const accessTokenCookie = cookies.find(cookie => cookie.startsWith('accessToken='));
  const refreshTokenCookie = cookies.find(cookie => cookie.startsWith('refreshToken='));

  if (!accessTokenCookie && !refreshTokenCookie) {
    return true;
  }

  const accessToken = accessTokenCookie?.split('=')[1];
  const refreshToken = refreshTokenCookie?.split('=')[1];

  try {
    const decodedAccessToken = jwt_decode(accessToken) as { exp: number };
    const decodedRefreshToken = jwt_decode(refreshToken) as { exp: number };

    const accessTokenExpired = decodedAccessToken.exp * 1000 < Date.now();
    const refreshTokenExpired = decodedRefreshToken.exp * 1000 < Date.now();

    if (accessTokenExpired && !refreshTokenExpired) {
      refreshToken();
    } else if (accessTokenExpired && refreshTokenExpired) {
      window.location.href = '/';
    }

  } catch (error: any) {
    console.error('Error decoding tokens:', error.message);
    window.location.href = '/';
  }
}

const MyRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login authApi={new AuthApi()} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default MyRoutes;

function jwt_decode(accessToken: string | undefined): { exp: number; } {
  throw new Error('Function not implemented.');
}
