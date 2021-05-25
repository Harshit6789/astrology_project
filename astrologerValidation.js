const Joi = require('joi');

let astrovalidate = function (req, res, next) {

    const data = req.body;
    const validateSchema = Joi.object().keys({
        firstName: Joi.string().min(3).max(10).required(),
        lastName: Joi.string().min(3).max(10).required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(4),
        experience: Joi.string().required(),
        specialisation: Joi.string().required()
    });
    const { error } = validateSchema.validate(data);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        next();
    }
}

module.exports = astrovalidate;


