const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');


router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const g = new Genre({
      name: req.body.name
  })
  try {
      const genre = await g.save();
      res.send(genre);
  } catch(ex) {
      res.status(400).send('Insert failed.. Invalid genre name');
  }
});

router.put('/:id', async (req, res) => {
//   const genre = genres.find(c => c.id === parseInt(req.params.id));
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
      genre.name = req.body.name;
      const genreUpd = await genre.save();
      res.send(genreUpd);
  } catch(ex) {
    res.status(400).send('Update failed.. Invalid genre name');
  }
});

router.delete('/:id', async (req, res) => {
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
