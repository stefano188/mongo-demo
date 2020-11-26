
const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        throw(new Error('FATAL: enviroment variable jwtPrivateKey is not set'));
    } 
};
