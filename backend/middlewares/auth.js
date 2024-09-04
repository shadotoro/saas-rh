const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
// Récupérer le token de l'en-tête de la requête
    const token = req.header('x-auth-token');

// Vérifier si le token est fourni
    if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    try {
// Vérifier et décoder le token
    const decoded = jwt.verify(token, 'secretkey');  // Utiliser la même clé secrète utilisée pour signer le token
    req.user = decoded;  // Ajouter l'utilisateur décodé à req pour une utilisation ultérieure dans la route
    next();
    } catch (error) {
    res.status(400).json({ message: 'Token invalide.' });
    }
}

module.exports = authMiddleware;
