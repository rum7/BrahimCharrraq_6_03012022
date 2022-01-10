// On importe les packages nécessaires
const express = require('express');
const router = express.Router();

// On déclare notre controller user
const userCtrl = require('../controllers/user');

// on définit nos routes signup et login
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;