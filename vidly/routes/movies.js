
const express = require('express');
const router = express.Router();
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    // TODO: check GET /:789
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send('The movie with given ID is not found');
    res.send(movie);
});

router.post('/', async (req, res) => {
    console.log('movie post', req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genreObj = new Genre({
        name: req.body.genre.name
    });
    
    const m = new Movie({
        title: req.body.title,
        genre: genreObj,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    try {
        const movie = await m.save();
        res.send(movie);
    } catch (err) {
        logErrors(err);
        res.status(404).send('Cannot insert movie.. ' + err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const genreObj = new Genre({
            name: req.body.genre.name
        });
        const movieUpd = await Movie.findByIdAndUpdate({ _id: req.params.id },
            {
                $set: {
                    title: req.body.title,
                    genre: genreObj,
                    numberInStock: req.body.numberInStock,
                    dailyRentalRate: req.body.dailyRentalRate
                }
            }, { new: true});
        res.send(movieUpd);
    } catch (err) {
        console.error(err);
        logErrors(err);
        res.status(400).send('Cannot update movie..' + err);
    }
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id , (err) => {
        if (err) {
            logErrors(err);
            res.status(404).send('Cannot remove movie..' + err);
        }
    });
    res.send(movie);
});

function logErrors(err) {
    let errors = '';
    for (field in err.errors) {
        console.log(err.errors[field].message);
        errors += "[ " + err.errors[field].message + " ]";
    }
    return errors;
}

module.exports = router;
//exports = router;
