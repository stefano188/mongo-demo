
const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        console.error('FATAL: enviroment variable jwtPrivateKey is not set');
        process.exit(1);
    } 
};
