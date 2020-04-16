const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

userSchema.methods.testMethod = function() {
    console.log('test method called');
}

const User = mongoose.model('User', userSchema);

// testMethodBis is not a function.. 
// All the functions should be declared before creating User object 
//      const User = mongoose.model('User', userSchema);
userSchema.methods.testMethodBis = function() {
    console.log('test method called');
}

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().min(5).required().email(),
        password: Joi.string().min(5).required()
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
