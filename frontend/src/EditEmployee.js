import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error("Token d'authentification manquant");
                }
                const response = await axios.get(`${API_URL}/employees/${id}`, {
                    headers: { 'x-auth-token': token }
                });
                setEmployee(response.data);
            } catch (error) {
                setError(`Erreur lors de la récupération des détails de l'employé: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!employee.email.includes('@')) {
            setError('Adresse e-mail invalide');
            return false;
        }
        // Ajoutez d'autres validations si nécessaire
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Token d'authentification manquant");
            }
            await axios.put(`${API_URL}/employees/${id}`, employee, {
                headers: { 'x-auth-token': token }
            });
            navigate('/employees');
        } catch (error) {
            setError(`Erreur lors de la mise à jour de l'employé: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Chargement...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

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
                <div className="md:col-span-2 flex justify-end">
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white p-2 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Mise à jour...' : 'Modifier'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditEmployee;
