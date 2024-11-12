// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TripList from './components/TripList';
import UserManager from './components/UserManager';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route login */}
        <Route path="/login" element={<Login />} />

        {/* Private route for /admin_page */}
        <Route
          path="/admin_page/*"
          element={
            <PrivateRoute redirectTo="/login">
              <div className="d-flex">
                <Sidebar />
                <div className="w-100">
                  <Header />
                  <div className="p-4">
                    <Routes>
                      {/* Sub-routes for /admin_page */}
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="trip" element={<TripList />} />
                      <Route path="users" element={<UserManager />} />
                      {/* Redirect /admin_page to /admin_page/dashboard */}
                      <Route path="" element={<Navigate to="dashboard" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* Redirect tất cả đường dẫn không tồn tại về login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
