// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, redirectTo }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to={redirectTo} replace />;
}

export default PrivateRoute;
