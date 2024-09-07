const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User, Employee } = require('./models');
const authMiddleware = require('./middlewares/auth');

const app = express();

// Activer CORS pour les requêtes provenant de localhost:3000 (frontend)
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(helmet());
app.use(express.json());

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

    const token = jwt.sign({ userId: user.id, email: user.email }, 'secretkey', { expiresIn: '1h' });

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
console.log('Request Body:', req.body); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! à supprimer !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    try {
    const { firstName, lastName, email, jobTitle, dateOfBirth } = req.body;

    if (!firstName || !lastName || !email || !jobTitle || !dateOfBirth) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
        return res.status(400).json({ message: "Un employé avec cet email existe déjà" });
    }

    const newEmployee = await Employee.create({
        firstName,
        lastName,
        email,
        jobTitle,
        dateOfBirth
    });

    res.status(201).json({
        id: newEmployee.id,
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        email: newEmployee.email,
        jobTitle: newEmployee.jobTitle,
        dateOfBirth: newEmployee.dateOfBirth,
        message: "Employé créé avec succès"
    });
    } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'employé", error });
    }
});

// Route pour lister tous les employés
app.get('/employees', authMiddleware, async (req, res) => {
    try {
    const employees = await Employee.findAll();
    res.status(200).json(employees);
    } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des employés", error });
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

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
