// On importe les packages nécessaires
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// On définit le model user
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// On empêche l'utilisation d'un email pour la création de plus d'un compte avec ce plugin
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);