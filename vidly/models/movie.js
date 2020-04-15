
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { Genre, genreSchema, validate } = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().required().min(3),
        genre: validate, // passing 'validate' Genre model function
        numberInStock: Joi.number().positive(),
        dailyRentalRate: Joi.number()
    });
    return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;
