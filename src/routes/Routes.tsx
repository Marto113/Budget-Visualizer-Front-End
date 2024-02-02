import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AuthApi from '../services/authApi';
import PrivateRoute from './PrivateRoutes';
import InitialPage from './InitialRoute';

const MyRoutes = () => {
  const authApiInstance = AuthApi;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/login" element={<Login authApi={authApiInstance} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/:id" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </Router>
  );
};

export default MyRoutes;