import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmployeesList = () => {
    const [employees, setEmployees] = useState([]);
    const navigate = useNavigate();  // Utilisé pour rediriger vers la page de modification

    useEffect(() => {
        // Récupérer le token JWT du localStorage
        const token = localStorage.getItem('token');
console.log('Token utilisé pour la requête GET:', token); ///////////////// à supprimer ///////////////////////////

        // Récupérer la liste des employés depuis l'API backend
        axios.get('http://localhost:5000/employees', {
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'  // Utiliser le token dans l'en-tête
            }
        })
        .then(response => {
            setEmployees(response.data);  // Mettre à jour l'état avec les employés
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des employés:', error);
        });
    }, []);

    // Fonction pour supprimer un employé
    const handleDelete = (id) => {
        // Récupérer le token JWT du localStorage
        const token = localStorage.getItem('token');

        // Envoyer une requête DELETE pour supprimer l'employé
        axios.delete(`http://localhost:5000/employees/${id}`, {
            headers: {
                'x-auth-token': token  // Utiliser le token dans l'en-tête
            }
        })
        .then(() => {
            // Mettre à jour la liste après suppression
            setEmployees(employees.filter(employee => employee.id !== id));
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'employé:', error);
        });
    };

    // Fonction pour rediriger vers la page de modification
    const handleEdit = (id) => {
        navigate(`/edit-employee/${id}`);  // Rediriger vers la page de modification
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-bold mb-6">Liste des employés</h1>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Prénom</th>
                        <th className="px-4 py-2">Nom</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Poste</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td className="border px-4 py-2">{employee.firstName}</td>
                            <td className="border px-4 py-2">{employee.lastName}</td>
                            <td className="border px-4 py-2">{employee.email}</td>
                            <td className="border px-4 py-2">{employee.jobTitle}</td>
                            <td className="border px-4 py-2">
                                <button
                                    onClick={() => handleEdit(employee.id)}
                                    className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(employee.id)}
                                    className="bg-red-500 text-white px-4 py-1 rounded"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeesList;
