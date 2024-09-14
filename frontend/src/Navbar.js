import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
	const navigate = useNavigate();
	const userRole = localStorage.getItem('userRole');

	const handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userRole');
		navigate('/login');
	};

	return (
		<nav className="bg-gray-800 p-4">
			<div className="container mx-auto flex justify-between items-center">
				<Link to="/dashboard" className="text-white text-xl font-bold">SaaS RH</Link>
				<div className="space-x-4">
					<Link to="/dashboard" className="text-white hover:text-gray-300">Tableau de bord</Link>
					<Link to="/employees" className="text-white hover:text-gray-300">Employés</Link>
					<Link to="/create-employee" className="text-white hover:text-gray-300">Ajouter un employé</Link>
					{userRole === 'admin' && (
						<Link to="/users" className="text-white hover:text-gray-300">Utilisateurs</Link>
					)}
					<button onClick={handleLogout} className="text-white hover:text-gray-300">Déconnexion</button>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
