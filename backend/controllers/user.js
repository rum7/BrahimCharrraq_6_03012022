// On importe les packages nécessaires
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config()

// Fonction permettant de créer un nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        // On sauvegarde notre utilisateur
        user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Fonction permettant à l'utilisateur de se connecter
exports.login = (req, res, next) => {
    // On récupère l'utilisateur de la bdd qui correspond à l'email entrée
    User.findOne({ email: req.body.email })
    .then( user => {
        // En cas d'email incorrect on renvoie une erreur
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé !'});
        }
        // On compare le mdp entré au hash enregistré dans la bdd
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            // S'il ne correspond pas on renvoie une erreur
            if (!valid) {
                return res.status(401).json({ message: 'Mot de passe incorrect !'});
            }
            // Autrement on renvoie le userId et le token d'authentification attendu par le frontend
            res.status(200).json({ 
                userId: user._id,
                token: jwt.sign(
                    { userId: user._id },
                    process.env.TKN_KEY,
                    { expiresIn: '24h' }
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};