const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customer: {
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
    },
    movie: {
        title: {
            type: String,
            required: true,
            trim: true, 
            minlength: 5,
            maxlength: 255
          },
          dailyRentalRate: { 
            type: Number, 
            required: true,
            min: 0,
            max: 255
          } 
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    });

    return schema.validate(rental);
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;
