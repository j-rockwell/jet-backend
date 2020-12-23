'use strict';

const http = require('http');
const app = require('../app');

// Initialize .env file
require('dotenv').config();

/**
 * Returns a normalized port to initialize a server ewith
 * @param {*} value 
 */
function getNormalizedPort(value) {
    const port = parseInt(value, 10);

    if ( Number.isNaN(port) ) {
        return value;
    }

    if ( port >= 0 ) {
        return port;
    }

    return false;
}

/**
 * Get port from environment and store in Express
 */
const port = getNormalizedPort(process.env.PORT || 3000);
app.set('port', port);

/**
 * Set the environment variable
 */
app.set('env', process.env.NODE_ENV);

/**
 * Initialize a new HTTP server
 */
const server = http.createServer(app);

/**
 * Handles specific listen errors
 * @param {*} err Error
 */
function onError(err) {
    if (err.syscall !== 'listen') {
        throw err;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    switch ( err.code ) {
        case 'EACCES':
            console.error(`${bind} requires elevated privledges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw err;
    }
}

/**
 * Handles sending the success response when server listening has begun
 */
function onListening() {
    const addr = server.address();
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    console.log("     ");
    console.log("==================== [ JET Backend Initialized ] ====================")

    console.log(`Listening on ${bind} in ${app.get('env')} environment`);
    console.log(`Server is now ready on port ${addr.port}`);

    if ( process.env.NODE_ENV === 'development' ) {
        console.log("You can now visit http://localhost:" + port + "/");
    }

    console.log("=====================================================================");
    console.log("     ");
    console.log("Be advised for any issues or errors printed while the initial setup is being finalized.");
    console.log("     ");
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);