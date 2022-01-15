// On importe les packages nécessaires
const express = require('express');
const mongoose = require('mongoose');
const helmet = require("helmet");
require('dotenv').config()

// Initialisation de l'API
const app = express();
app.use(express.json());

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');

// On se connecte à mongoDB
mongoose.connect(process.env.DBCONNECT,
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

// Mise en place des headers à notre objet response
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;