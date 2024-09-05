import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import EmployeesList from '../src/EmployeesList';
import CreateEmployee from './CreateEmployee';
import EditEmployee from './EditEmployee';

function App() {
  return (
    <Router>
      <Navbar />
    <div className="container mx-auto p-6">
        <Routes>
          <Route path="/employees" element={<EmployeesList />} />
          <Route path="/create-employee" element={<CreateEmployee />} />
          <Route path="/edit-employee/:id" element={<EditEmployee />} />
          <Route path="/" element={<h1 className="text-4xl font-bold text-center">Bienvenue dans SaaS RH</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
