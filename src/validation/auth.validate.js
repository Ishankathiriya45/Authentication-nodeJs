const Joi = require("joi");

const adminAuthValidate = {
    adminRegister: Joi.object().keys({
        name: Joi.string().min(3).max(128).required().messages({
            "any.required": "name is mandatory",
            "any.empty": "name is mandatory",
        }),
        email: Joi.string().email().required().messages({
            "any.required": "email is mandatory",
            "any.empty": "email is mandatory",
        }),
        password: Joi.string().required().regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$/
        ).messages({
            "any.required": "email is mandatory",
            "any.empty": "email is mandatory",
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.',
        }),
        phone: Joi.string().required().regex(
            /^\d{10}$/
        ).messages({
            'string.pattern.base': 'Phone number must contain digits only.',
            'string.empty': 'Phone number is required.',
        })
    }),

    login: Joi.object().keys({
        email: Joi.string().email().required().messages({
            "any.required": "email is mandatory",
            "any.empty": "email is mandatory",
        }),
        password: Joi.string().required().regex(
            /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,}$/
        ).messages({
            "any.required": "email is mandatory",
            "any.empty": "email is mandatory",
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.',
        }),
    })
}

module.exports = {
    adminAuthValidate,
}