const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/db')();
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => winston.info(`Listening on port ${port}...`));
}

module.exports = app;
