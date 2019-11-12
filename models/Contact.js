const mongoose = require('mongoose');
const Joi = require('joi');

const contactSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    name: { type: String, required: true },
    phone: String,
    email: { type: String, required: true },
    type: { type: String, default: 'personal' },
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

function validateContact(contact) {
    const schema = {
        name: Joi.string().required(),
        phone: Joi.string(),
        email: Joi.string()
            .email()
            .required(),
        type: Joi.string()
    };

    return Joi.validate(contact, schema, { abortEarly: false });
}

module.exports = { Contact, validateContact };
