import React, { useState } from 'react';
import axios from 'axios';

const CreateEmployee = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Créer un nouvel employé avec les données du formulaire
        axios.post('http://localhost:3000/employees', {
            firstName,
            lastName,
            email,
            jobTitle,
            dateOfBirth
        }, {
            headers: {
                'x-auth-token': 'ton_token_jwt'  // Remplace par ton token JWT valide
            }
        })
        .then(response => {
            console.log('Employé créé avec succès:', response.data);
            // Optionnel : vider les champs du formulaire
            setFirstName('');
            setLastName('');
            setEmail('');
            setJobTitle('');
            setDateOfBirth('');
        })
        .catch(error => {
            console.error('Erreur lors de la création de l\'employé:', error);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="container mx-auto p-6 space-y-4">
            <h1 className="text-3xl font-bold mb-6">Créer un Nouvel Employé</h1>
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
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Créer l'employé</button>
        </form>
    );
};

export default CreateEmployee;
