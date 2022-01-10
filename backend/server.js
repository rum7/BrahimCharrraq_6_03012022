// On importe les packages nécessaires
const http = require('http');
const app = require('./app');

// On renvoie un port valide quelle que soit sa forme (string ou nombre)
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// On recherche et gère les différents types d'erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// On démarre le serveur
const server = http.createServer(app);

// On renvoie une erreur ou bien le port sur lequel le serveur est exécuté
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port:' + port;
    console.log('Listening on ' + bind);
});

// On écoute le port
server.listen(port);
  