
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        phone: Joi.string().min(5).required(),
        isGold: Joi.boolean()
    });

    const result = schema.validate(customer);
    console.log('validation', result);
    return result;
}

exports.Customer = Customer;
exports.validate = validateCustomer;
