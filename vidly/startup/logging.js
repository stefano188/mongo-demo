
require('express-async-errors');
const winston = require('winston');

module.exports = function () {

    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'uncaughtExceptions.log' }));

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });

    const fileTransport = new winston.transports.File({ filename: 'logfile.log' });
    winston.add(fileTransport);
}
