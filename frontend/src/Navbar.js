import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
    <nav className="bg-blue-600 p-4 text-white">
        <div className="container mx-auto flex justify-between">
            <div>
                <h1 className="text-xl font-bold">SaaS RH</h1>
            </div>
            <div className="space-x-4">
                <Link to="/employees" className="hover:text-gray-300">Liste des employés</Link>
                <Link to="/create-employee" className="hover:text-gray-300">Créer un employé</Link>
                <Link to="/absences" className="hover:text-gray-300">Gestion des absences</Link>
            </div>
        </div>
    </nav>
    );
};

export default Navbar;
