import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Bienvenue dans SaaS RH</h1>
            <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Se connecter
            </Link>
    </div>
    );
};

export default Home;