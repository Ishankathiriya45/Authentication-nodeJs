const Joi = require("joi");

const bikeValidate = {
    createBike: Joi.object().keys({
        brand: Joi.string().required().messages({
            "any.required": "brand name is mandatory",
            "any.empty": "brand name is mandatory",
        }),
        model: Joi.string().required().messages({
            "any.required": "model name is mandatory",
            "any.empty": "model name is mandatory",
        }),
        year: Joi.string().required().messages({
            "any.required": "year is mandatory",
            "any.empty": "year is mandatory",
        }),
        price: Joi.number().required().messages({
            "number.base": "Price must be a number.",
        }),
        category: Joi.string().required().messages({
            "any.required": "category is mandatory",
            "any.empty": "category is mandatory",
        }),
        status: Joi.string().required().messages({
            "any.required": "status is mandatory",
            "any.empty": "status is mandatory",
        }),
        description: Joi.string().allow(null),
    })
}

module.exports = {
    bikeValidate,
}