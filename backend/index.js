const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { User } = require('./models');
const authMiddleware = require('./middlewares/auth');

const app = express();
app.use(helmet());
app.use(express.json());

// Route d'enregistrement (signup)
app.post('/signup', [
// Validation des champs
    check('firstName', 'Le prénom est obligatoire').not().isEmpty(),
    check('lastName', 'Le nom de famille est obligatoire').not().isEmpty(),
    check('email', 'Veuillez entrer un email valide').isEmail(),
    check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
    ], async (req, res) => {
// Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

// Si aucune erreur, continuer avec l'inscription
    try {
        const { firstName, lastName, email, password } = req.body;

// Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
        return res.status(400).json({ message: 'L\'email est déjà utilisé' });
        }

// Chiffrer le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

// Créer un nouvel utilisateur
        const newUser = await User.create({
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword
        });

// Retourner une réponse indiquant que l'utilisateur a été créé
        res.status(201).json({
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        message: 'Utilisateur créé avec succès'
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
    }
    });



// Route de connexion (login)
app.post('/login', [
// Validation des champs
    check('email', 'Veuillez entrer un email valide').isEmail(),
    check('password', 'Le mot de passe est obligatoire').not().isEmpty()
    ], async (req, res) => {
// Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

// Si aucune erreur, continuer avec la connexion
    try {
        const { email, password } = req.body;

// Vérifier si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
        return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

// Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

// Générer un token JWT
        const token = jwt.sign(
        { userId: user.id, email: user.email },
        'secretkey',  // UTILISER UNE CLE PLUS ROBUSTE EN PRODUCTION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        { expiresIn: '1h' }  // Durée de validité du token
        );

// Retourner le token et les informations utilisateur
    res.status(200).json({
        token,
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        },
        message: 'Connexion réussie'
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
    });

// créer un nouvel employé
    app.post('/employees', authMiddleware, async (req, res) => {
        try {
            const { firstName, lastName, email, jobTitle, dateOfBirth } = req.body;
    
            // Vérifier si l'employé existe déjà
            const existingEmployee = await Employee.findOne({ where: { email } });
            if (existingEmployee) {
                return res.status(400).json({ message: 'Un employé avec cet email existe déjà' });
            }
    
            // Créer un nouvel employé
            const newEmployee = await Employee.create({
                firstName,
                lastName,
                email,
                jobTitle,
                dateOfBirth
            });
    
            // Retourner les informations de l'employé créé
            res.status(201).json({
                id: newEmployee.id,
                firstName: newEmployee.firstName,
                lastName: newEmployee.lastName,
                email: newEmployee.email,
                jobTitle: newEmployee.jobTitle,
                dateOfBirth: newEmployee.dateOfBirth,
                message: 'Employé créé avec succès'
            });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la création de l\'employé', error });
        }
    });
    

app.get('/', (req, res) => {
    res.send('Welcome to the SaaS RH API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
