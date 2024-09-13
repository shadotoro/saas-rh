const bcrypt = require('bcryptjs');
const { User } = require('./models');
require('dotenv').config();

async function seedAdmin() {
    try {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    
    const adminUser = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        role: 'admin'
    });

    console.log('Admin user created:', adminUser.email);
    } catch (error) {
    console.error('Error seeding admin user:', error);
    }
}

seedAdmin();