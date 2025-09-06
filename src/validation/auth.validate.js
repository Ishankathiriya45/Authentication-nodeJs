const Joi = require("joi");

const adminAuthValidate = {
  adminRegister: Joi.object().keys({
    name: Joi.string()
      .min(3)
      .max(128)
      .required()
      .regex(/^[a-zA-Z][a-zA-Z]*$/)
      .messages({
        "any.required": "name is mandatory",
        "string.empty": "name cannot be empty",
        "string.min": "Name must be at least {#limit} characters long.",
        "string.max":
          "Name must be less than or equal to {#limit} characters long.",
        "string.pattern.base":
          "Name must only contain alphabetic characters and spaces.",
      }),

    email: Joi.string().email().required().messages({
      "string.email": "please provide a valid email address",
    }),

    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,128}$/)
      .messages({
        "any.required": "email is mandatory",
        "string.min": "Password must be at least {#limit} characters long.",
        "string.max":
          "Password must be less than or equal to {#limit} characters long.",
        "string.pattern.base":
          "Password must contain at least one letter and one number.",
      }),

    phone: Joi.number()
      .integer()
      .min(1000000000) // minimum 10-digit number (adjust if needed)
      .max(9999999999) // maximum 10-digit number (for standard mobile)
      .required()
      .messages({
        "number.empty": "Phone number cannot be empty.",
        "number.min": "Phone number must have exactly 10 digits",
        "number.max": "Phone number must have exactly 10 digits",
      }),
  }),

  login: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.email": "please provide a valid email address",
    }),

    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,128}$/)
      .messages({
        "any.required": "email is mandatory",
        "string.min": "Password must be at least {#limit} characters long.",
        "string.max":
          "Password must be less than or equal to {#limit} characters long.",
        "string.pattern.base":
          "Password must contain at least one letter and one number.",
      }),
  }),
};

module.exports = {
  adminAuthValidate,
};
