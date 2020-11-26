
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid user login');

    // remember: the sault is included in user.password 
    // compare method extracts that sault and use it to hash req.body.password and compare with user.password 
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).send('Invalid user login');

    const token = user.generateAuthToken();
    
    user.testMethod(); // works
    // user.testMethodBis(); is not a function
    
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(5).required()
    });

    return schema.validate(req);
}

module.exports = router;
