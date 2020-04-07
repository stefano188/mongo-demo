
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connected to MongoDB ...'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

