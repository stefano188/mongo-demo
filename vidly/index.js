
require('express-async-errors');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const winston = require('winston');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const app = express();

const fileTransport = new winston.transports.File({ filename: 'logfile.log' });
winston.add(fileTransport);

console.log(`****NODE_ENV: ${process.env.NODE_ENV}`);

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL: enviroment variable jwtPrivateKey is not set');
    process.exit(1);
} 

mongoose.connect(
        'mongodb://localhost/vidly',
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongodb vidly...'))
    .catch((err) => console.error('cannot connect to mongodb...'));


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
