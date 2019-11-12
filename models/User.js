const mongoose = require('mongoose');
const Joi = require('joi');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

function validateUserRegister(user) {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .required()
            .min(6)
    };
    return Joi.validate(user, schema, { abortEarly: false });
}

function validateUserLogin(user) {
    const schema = {
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string().required()
    };
    return Joi.validate(user, schema);
}

async function hashPassword(password) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
}

module.exports = {
    User,
    validateUserRegister,
    hashPassword,
    validateUserLogin
};
