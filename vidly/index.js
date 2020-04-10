

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(
        'mongodb://localhost/vidly',
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to mongodb vidly...'))
    .catch((err) => console.error('cannot connect to mongodb...'));


app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
