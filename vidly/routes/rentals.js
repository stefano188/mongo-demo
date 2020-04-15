
const mongoose = require('mongoose');
const express = require('express');
const Fawn = require('fawn');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut'); // sort by dateOut descending
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('Rental with the given ID not found');
    res.send(rental);
});

router.post('/', async (req, res) => {
    console.log('rentals post', req.body);
    console.log('rentals post customerId', req.body.customerId);
    console.log('rentals post movieId', req.body.movieId);
    const { error } = validate(req.body);
    console.log('Joi validation error', error);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer ID');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie ID');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    // Transaction with Fawn
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, 
            { 
                $inc: { numberInStock: -1 } 
            })
            .run()
                .then(() => {
                    console.log('task run');
                })
                .catch((err) => {
                    if (err) {
                        console.log('task error', err);
                    }
                })

        res.send(rental);
    } catch (ex) {
        console.log(ex);
        res.status(500).send('Something failed.');
    }

    // rental = await rental.save('', (err) => {
    //     if (err) {
    //         console.error(err);
    //         return res.status(400).send('error saving rental' + err);
    //     }
    // });

    // movie.numberInStock--;
    // await movie.save();

    
})

module.exports = router;
