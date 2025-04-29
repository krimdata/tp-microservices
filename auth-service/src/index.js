const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');  // Assure-toi que bcrypt est installé
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
app.use(express.json()); // Ajoute cette ligne pour parser les requêtes JSON

const PORT = process.env.PORT || 3000;

// Clé secrète pour signer le JWT
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';  // Change cette clé par quelque chose de plus sécurisé en production

// Simule une base de données des utilisateurs
const usersDB = [];

// Inscription d'un utilisateur (POST /auth/register)
app.post(
  '/auth/register',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 5 }).withMessage('Mot de passe trop court'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    if (usersDB.find((user) => user.email === email)) {
      return res.status(400).json({ error: 'L\'utilisateur existe déjà' });
    }

    // Hash le mot de passe avant de le sauvegarder
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur de hashage du mot de passe' });
      }

      // Sauvegarder l'utilisateur
      const newUser = { email, password: hashedPassword };
      usersDB.push(newUser);

      // Créer un token JWT
      const token = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

      // Répondre avec le token
      res.json({ message: 'Registered', token });
    });
  }
);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});



