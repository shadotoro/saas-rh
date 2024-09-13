import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const userRole = localStorage.getItem('userRole');

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tableau de bord SaaS RH</h1>
            <nav className="mb-4">
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/employees" className="text-blue-500 hover:underline">Liste des employés</Link>
                    </li>
                    <li>
                        <Link to="/create-employee" className="text-blue-500 hover:underline">Créer un employé</Link>
                    </li>
                    {userRole === 'admin' && (
                    <li>
                        <Link to="/users" className="text-blue-500 hover:underline">Gestion des utilisateurs</Link>
                    </li>
                    )}
                </ul>
            </nav>
        {/* Vous pouvez ajouter ici des widgets ou des résumés */}
        </div>
    );
};

export default Dashboard;
