
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const { User, validate } = require('../models/user');

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await User.find().sort('email');
    res.send(users);
});

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select(['-password','-_id','-__v']);
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    // lodash approach
    // from req.body pick 'name',email','password' properties. Equivalend to req.body.name, ...
    user = new User(_.pick(req.body, ['name','email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    // avoid sending password
    // res.send(user); 

    // first approach
    // res.send({
    //     name: user.name,
    //     email: user.email
    // });

    // lodash approach
    // _.pick(user, ['name', 'email']);

    // get the token
    //const token = jwt.sign({ id: user._id }, config.get('jwtPrivateKey'));
    const token = user.generateAuthToken();
    // and send the token as header
    // header key should be prefix with 'x-'
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

})

module.exports = router;
