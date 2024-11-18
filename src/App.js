import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TripList from './components/TripList';
import UserManager from './components/UserManager';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import HomeList from './components/homelist'; // Import HomeList instead of HomeCard
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsPage from './components/setting_page';

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
                  <div className="p-4">
                    <Routes>
                      {/* Sub-routes for /admin_page */}
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="trip" element={<TripList />} />
                      <Route path="users" element={<UserManager />} />
                      <Route path="home" element={<HomeList />} /> 
                      <Route path="setting" element={<SettingsPage />} /> 
                      <Route path="" element={<Navigate to="dashboard" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </PrivateRoute>
          }
        />

        {/* Redirect all non-existent routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
