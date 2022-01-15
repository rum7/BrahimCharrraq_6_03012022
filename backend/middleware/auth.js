// On importe les packages nécessaires
const jwt = require('jsonwebtoken');
require('dotenv').config()

// Fonction qui teste le token d'authentification
module.exports = (req, res, next) => {
    try {
        // On récupère le token qui se trouve dans le header "authorization" et on l'isole
        const token = req.headers.authorization.split(' ')[1];
        // On vérifie le token avec la clé que l'on a créé
        const decodedToken = jwt.verify(token, process.env.TKN_KEY);
        // On récupère l'userId du token
        const userId = decodedToken.userId;
        // On s'assure que l'userId de la requête correspond à celui de la sauce
        // Autrement on empêche la modification ou suppression
        // On attribue un objet auth à la requête qui comportera l'userId décodé (pour plus de flexibilité)
        req.auth = { userId }; /* { userId : userId } <=> { userId } */
        // Si un userId est présent dans la requête et est différent de celui du token 
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !'});
    }
}