import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeesList from './EmployeesList';
import CreateEmployee from './CreateEmployee';
import EditEmployee from './EditEmployee';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <Router>
      <div className="container mx-auto p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/employees" element={
            <PrivateRoute>
              <EmployeesList />
            </PrivateRoute>
          } />
          <Route path="/create-employee" element={
            <PrivateRoute>
              <CreateEmployee />
            </PrivateRoute>
          } />
          <Route path="/edit-employee/:id" element={
            <PrivateRoute>
              <EditEmployee />
            </PrivateRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;