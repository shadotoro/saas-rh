import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newHires: 0,
    upcomingBirthdays: [],
    departmentDistribution: {}
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard-stats', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord RH</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Total des employés</h2>
          <p className="text-3xl font-bold">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Nouvelles embauches (30 derniers jours)</h2>
          <p className="text-3xl font-bold">{stats.newHires}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Anniversaires à venir</h2>
          <ul>
            {stats.upcomingBirthdays && stats.upcomingBirthdays.map((employee, index) => (
              <li key={index} className="mb-1">{employee.name} - {employee.date}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Distribution par département</h2>
          <ul>
            {Object.entries(stats.departmentDistribution || {}).map(([dept, count]) => (
              <li key={dept} className="mb-1">{dept}: {count} employé(s)</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;