const checkRole = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Accès non autorisé" });
    }
    next();
};

module.exports = checkRole;