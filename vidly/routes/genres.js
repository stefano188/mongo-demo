
// express-async-errors module implements the same function in ../middleware/async module
// and avoid to call everytime asyncMiddleware(...) in every routes handler
// const asyncMiddleware = require('../middleware/async');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');


router.get('/', async (req, res, next) => {
    // throw new Error('Error getting genres');
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
      name: req.body.name
  })
  genre = await genre.save();
  res.send(genre);
});

router.put('/:id', auth, async (req, res) => {
//   const genre = genres.find(c => c.id === parseInt(req.params.id));
  let genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  genre.name = req.body.name;
  await genre.save();
  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
//   const genre = genres.find(c => c.id === parseInt(req.params.id));
//   if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  const genre = await Genre.findByIdAndRemove(
      req.params.id, 
      (err) => {
          if (err) {
              res.status(404).send('The genre with the given ID was not found.')
          }
      });

  res.send(genre);
});

router.get('/:id', async (req, res) => {
//   const genre = genres.find(c => c.id === parseInt(req.params.id));
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

module.exports = router;
