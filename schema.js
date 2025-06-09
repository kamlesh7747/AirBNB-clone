const Joi = require('joi');

const listingSchema = Joi.object({

    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
        filename: Joi.string(),
        url: Joi.string().uri()
    }),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required()

});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5),
        comment: Joi.string().required(),
        // listingId: Joi.string().required(),  // this will be added after the execution of validation middleware
    }).required()
});

module.exports = { listingSchema, reviewSchema };
