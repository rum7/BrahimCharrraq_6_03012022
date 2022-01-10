// On importe les packages nécessaires
const multer = require('multer');

// On définit les extensions de fichier
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// On configure un objet "multer"
const storage = multer.diskStorage({
    // On indique où enregistrer les fichiers
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // On précise le nom du fichier à utiliser
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// On exporte
module.exports = multer({ storage }).single('image');