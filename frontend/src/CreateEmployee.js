import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const CreateEmployee = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateForm = () => {
        if (!email.includes('@')) {
            setError('Adresse e-mail invalide');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setError("Erreur d'authentification. Veuillez vous reconnecter.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/employees`, {
                firstName,
                lastName,
                email,
                jobTitle,
                dateOfBirth
            }, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Employé créé avec succès:', response.data);
            // Réinitialiser le formulaire ou rediriger l'utilisateur
        } catch (error) {
            console.error('Erreur lors de la création de l\'employé:', error);
            setError('Erreur lors de la création de l\'employé. Veuillez réessayer.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container mx-auto p-6 space-y-4">
            <h1 className="text-3xl font-bold mb-6">Créer un Nouvel Employé</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div>
                <label className="block mb-2">Prénom</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border p-2 w-full" required />
            </div>
            <div>
                <label className="block mb-2">Nom</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border p-2 w-full" required />
            </div>
            <div>
                <label className="block mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" required />
            </div>
            <div>
                <label className="block mb-2">Poste</label>
                <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="border p-2 w-full" required />
            </div>
            <div>
                <label className="block mb-2">Date de Naissance</label>
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="border p-2 w-full" required />
            </div>
            <button 
                type="submit" 
                className="bg-blue-500 text-white p-2 rounded"
                disabled={loading}
            >
                {loading ? 'Création en cours...' : 'Créer l\'employé'}
            </button>
        </form>
    );
};

export default CreateEmployee;
