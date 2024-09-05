import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEmployee = () => {
    const { id } = useParams();  // Récupérer l'ID de l'employé à modifier
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        // Récupérer les détails de l'employé pour pré-remplir le formulaire
        axios.get(`http://localhost:3000/employees/${id}`, {
            headers: {
                'x-auth-token': 'ton_token_jwt'
            }
        })
        .then(response => {
            setEmployee(response.data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des détails de l\'employé:', error);
        });
    }, [id]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.put(`http://localhost:3000/employees/${id}`, employee, {
            headers: {
                'x-auth-token': 'ton_token_jwt'
            }
        })
        .then(() => {
            navigate('/employees');  // Rediriger vers la liste des employés après mise à jour
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour de l\'employé:', error);
        });
    };

    return (
        <div className="container mx-auto mt-10 max-w-4xl p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Modifier l'Employé</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Prénom</label>
                    <input
                        type="text"
                        name="firstName"
                        value={employee.firstName}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Nom</label>
                    <input
                        type="text"
                        name="lastName"
                        value={employee.lastName}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={employee.email}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Poste</label>
                    <input
                        type="text"
                        name="jobTitle"
                        value={employee.jobTitle}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-bold mb-2">Date de Naissance</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={employee.dateOfBirth}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Modifier</button>
            </form>
        </div>
    );
};

export default EditEmployee;
