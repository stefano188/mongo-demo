const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');


router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const g = new Customer({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
  })
  try {
      const customer = await g.save();
      res.send(customer);
  } catch (err) {
        const errors = logErrors(err);
        res.status(400).send('Insert failed.. ' + errors);
  }

});

router.put('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  try {
      customer.name = req.body.name;
      customer.phone = req.body.phone;
      customer.isGold = req.body.isGold;
      const customerUpd = await customer.save();
      res.send(customerUpd);
  } catch (err) {
    const errors = logErrors(err);
    res.status(400).send('Updated failed.. ' + errors);
  }
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(
      req.params.id, 
      (err) => {
          if (err) {
              res.status(404).send('The customer with the given ID was not found.')
          }
      });

  res.send(customer);
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  res.send(customer);
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
