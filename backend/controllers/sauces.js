// On importe les packages nécessaires
const Sauce = require('../models/Sauce');
const fs = require('fs');

// Middleware de création de nouvelle sauce
exports.createSauce = (req, res, next) => {
    // On extrait l'object JSON de sauce et on le stocke les informations dans sauceObject
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; /* On supprimer le mauvais id renvoyé par le frontend */
    // On crée notre nouvelle sauce
    const sauce = new Sauce({
        ...sauceObject, /* On utilise l'opérateur spread pour copier les champs contenu dans le corps de la requête */
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, /* protocol = http(s) - host = racine du serveur */
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // On sauvegarde la nouvelle sauce
    sauce.save()
    .then(() => res.status(201).json({ message: "Nouvelle sauce enregistrée !"}))
    .catch((error) => res.status(400).json({ error }));
};

// Middleware de modification de sauce
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? /* On utilise l'opérateur ternaire pour savoir si "req.file" existe ou non */
        {
            // Le fichier existe, on récupère les informations de l'objet et on modifie l'url de l'image
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        } : { 
            // Le fichier n'existe pas, on prend simplement le corps de la requête
            ...req.body 
        };
    // On prend l'objet créé et on modifie son id de sorte à ce qu'il corresponde à l'id des paramètres de requête
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
    .catch((error) => res.status(400).json({ error }));
};

// Middleware de suppression de sauce
exports.deleteSauce = (req, res, next) => {
    // On identifie la sauce à supprimer
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        // On définit le nom du fichier à supprimer
        const filename = sauce.imageUrl.split('/images/')[1];
        // À l'aide de la fonction unlink du package fs, 
        // Le 1er argument correspond au chemin du fichier à supprimer 
        // Le 2e argument est le callback: on supprime la sauce une fois le fichier supprimer
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
            .catch((error) => res.status(400).json({ error }));
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Middleware de récupération d'une sauce spécifique
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

// Middleware de récupération de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// Middleware de like et dislike d'une sauce
exports.likesASauce = (req, res, next) => {
    const userId = req.body.userId;
    const likeStatement = req.body.like;
  
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
        /**/
        const alreadyLiked = sauce.usersLiked.find((id) => id === userId);
        const alreadyDisliked = sauce.usersDisliked.find((id) => id === userId);
        /**/

        switch(likeStatement) {
            case 1:
                sauce.likes++;
                sauce.usersLiked.push(userId);
                console.log("--------------");
                console.log("YES! On vient d'avoir un like de "+userId);
                break;
            case 0:
                if(alreadyLiked) {
                    sauce.likes--;
                    sauce.usersLiked = sauce.usersLiked.filter((id) => id !== userId);
                    console.log("--------------");
                    console.log("On avait déjà un like de "+alreadyLiked);
                    console.log("Du coup on l'a perdu...");
                }
                if(alreadyDisliked) {
                    sauce.dislikes--;
                    sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== userId);
                    console.log("--------------");
                    console.log("On avait déjà un dislike de "+alreadyDisliked);
                    console.log("Fiou plus de dislike, maintenant faut like hein...");
                }
                break;
            case -1:
                sauce.dislikes++;
                sauce.usersDisliked.push(userId);
                console.log("--------------");
                console.log("Ah relou, on vient d'avoir un dislike de "+userId);
                break;
        }
        sauce.save()
        .then(() => res.status(201).json({ message: "Vote enregistré !"}))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};