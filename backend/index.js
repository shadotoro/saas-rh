require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User, Employee } = require('./models');
const authMiddleware = require('./middlewares/auth');
const checkRole = require('./middlewares/checkRole');
const devAuthMiddleware = require('./middlewares/devAuthMiddleware');
const { Sequelize, Op } = require('sequelize');

const app = express();

// Activer CORS pour les requêtes provenant de localhost:3000 (frontend)
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
        console.log('Origin de la requête:', origin);
        if (!origin || allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use((req, res, next) => {
    console.log('Requête reçue:', req.method, req.path);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    next();
});

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-auth-token');
    next();
});

// Middleware pour autoriser les requêtes OPTIONS
app.options('*', cors());

app.use(helmet());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(devAuthMiddleware);
    console.log('Mode développement : connexion automatique en tant qu\'admin');
}

// Route d'enregistrement (signup)
app.post('/signup', [
    check('firstName', 'Le prénom est obligatoire').not().isEmpty(),
    check('lastName', 'Le nom de famille est obligatoire').not().isEmpty(),
    check('email', 'Veuillez entrer un email valide').isEmail(),
    check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "L'email est déjà utilisé" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            passwordHash: hashedPassword
        });

        res.status(201).json({
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            message: "Utilisateur créé avec succès"
        });
    } catch (error) {
        console.log("Erreur lors de la création de l'utilisateur:", error);
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error });
    }
});

// Route de connexion (login)
app.post('/login', [
    check('email', 'Veuillez entrer un email valide').isEmail(),
    check('password', 'Le mot de passe est obligatoire').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            message: "Connexion réussie"
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la connexion", error });
    }
});

// Route pour créer un nouvel employé
app.post('/employees', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, email, jobTitle, dateOfBirth } = req.body;
        const newEmployee = await Employee.create({
            firstName,
            lastName,
            email,
            jobTitle,
            dateOfBirth
        });
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('Erreur lors de la création de l\'employé:', error);
        res.status(500).json({ message: "Erreur lors de la création de l'employé", error: error.message });
    }
});

// Route pour lister tous les employés
app.get('/employees', authMiddleware, checkRole(['admin', 'hr_manager', 'hr_staff']), async (req, res) => {
    console.log('Requête GET /employees reçue avec token utilisateur:', req.user);////////////////////////////////////
    try {
        const employees = await Employee.findAll();
        console.log('Employés récupérés:', employees);///////////////////////////////////////////
        res.status(200).json(employees);
    } catch (error) {
        console.log('Erreur lors de la récupération des employés:', error); /////////////////////////////////////////
        res.status(500).json({ message: 'Erreur lors de la récupération des employés', error });
    }
});

// Route pour obtenir les détails d'un employé spécifique
app.get('/employees/:id', authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employé non trouvé" });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des informations de l'employé", error });
    }
});

// Route pour mettre à jour un employé
app.put('/employees/:id', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, email, jobTitle, dateOfBirth } = req.body;
        const employee = await Employee.findByPk(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: "Employé non trouvé" });
        }

        employee.firstName = firstName || employee.firstName;
        employee.lastName = lastName || employee.lastName;
        employee.email = email || employee.email;
        employee.jobTitle = jobTitle || employee.jobTitle;
        employee.dateOfBirth = dateOfBirth || employee.dateOfBirth;

        await employee.save();

        res.status(200).json({ message: "Employé mis à jour avec succès", employee });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'employé", error });
    }
});

// Route pour supprimer un employé
app.delete('/employees/:id', authMiddleware, async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employé non trouvé" });
        }

        await employee.destroy();
        res.status(200).json({ message: "Employé supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'employé", error });
    }
});

// Route pour mettre à jour le rôle d'un utilisateur (réservée aux admins)
app.put('/users/:id/role', authMiddleware, checkRole(['admin']), [
    check('role', 'Le rôle doit être admin, hr_manager ou hr_staff').isIn(['admin', 'hr_manager', 'hr_staff'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        user.role = role;
        await user.save();

        res.json({ message: "Rôle de l'utilisateur mis à jour avec succès", user });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du rôle de l'utilisateur" });
    }
});

app.get('/api/dashboard-stats', authMiddleware, async (req, res) => {
    try {
        const totalEmployees = await Employee.count();

        const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
        const newHires = await Employee.count({
            where: {
                createdAt: {
                    [Op.gte]: thirtyDaysAgo
                }
            }
        });

        const today = new Date();
        const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
        const upcomingBirthdays = await Employee.findAll({
            attributes: ['firstName', 'lastName', 'dateOfBirth'],
            where: {
                dateOfBirth: {
                    [Op.and]: [
                        Sequelize.where(Sequelize.fn('date_part', 'month', Sequelize.col('dateOfBirth')), {
                            [Op.in]: [today.getMonth() + 1, (today.getMonth() + 1) % 12 + 1]
                            }),
                            Sequelize.where(Sequelize.fn('date_part', 'day', Sequelize.col('dateOfBirth')), {
                                [Op.between]: [today.getDate(), thirtyDaysLater.getDate()]
                            })
                        ]
                    }
                },
                order: [
                    [Sequelize.fn('date_part', 'month', Sequelize.col('dateOfBirth')), 'ASC'],
                    [Sequelize.fn('date_part', 'day', Sequelize.col('dateOfBirth')), 'ASC']
                    ]
                });

                const departmentDistribution = await Employee.findAll({
                    attributes: ['department', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
                    group: ['department']
                });

                res.json({
                    totalEmployees,
                    newHires,
                    upcomingBirthdays: upcomingBirthdays.map(emp => ({
                        name: `${emp.firstName} ${emp.lastName}`,
                        date: emp.dateOfBirth.toISOString().split('T')[0]
                    })),
                    departmentDistribution: Object.fromEntries(
                        departmentDistribution.map(dept => [dept.department, dept.get('count')])
                    )
                });
                } catch (error) {
                    console.error('Erreur lors de la récupération des statistiques:', error);
                    res.status(500).json({ message: 'Erreur serveur', error: error.message });
                }
        });

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
