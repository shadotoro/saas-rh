const { User } = require('../models');
const jwt = require('jsonwebtoken');

const devAuthMiddleware = async (req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        const adminUser = await User.findOne({ where: { email: 'admin@example.com' } });
        if (adminUser) {
            const token = jwt.sign(
                { userId: adminUser.id, email: adminUser.email, role: adminUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            req.headers['x-auth-token'] = token;
        }
    }
    next();
};

module.exports = devAuthMiddleware;