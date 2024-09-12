const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        console.log('Aucun token fourni.');
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    try {
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token décodé avec succès:', decoded);  ////////////////////////////////////////////////////
        req.user = decoded;  // Ajouter l'utilisateur décodé à req pour une utilisation ultérieure dans la route
        next();
    } catch (error) {
        console.log('Erreur lors de la vérification du token:', error.message);  ////////////////////////////
        return res.status(400).json({ message: 'Token invalide.' });
    }
}

module.exports = authMiddleware;
