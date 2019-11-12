const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { User } = require('../models/User');
const { Contact, validateContact } = require('../models/Contact');

// @route        GET /api/contacts
// @desc         get logged in user contacts
// @access       Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({
            date: -1
        });
        res.json(contacts);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route        POST /api/contacts
// @desc         Add a new Contact
// @access       Private
router.post('/', authMiddleware, async (req, res) => {
    const joiCheck = validateContact(req.body);
    if (joiCheck.error) {
        const errors = joiCheck.error.details.map(err => err.message);
        return res.status(400).send(errors);
    }

    try {
        const { name, phone, email, type } = req.body;
        let contact = new Contact({
            user: req.user.id,
            name,
            phone,
            email,
            type
        });
        contact = await contact.save();
        return res.send(contact);
    } catch (e) {
        console.error(e);
        return res.status(500).send('Server Error');
    }
});

// @route        PUT /api/contacts/:id
// @desc         Update contact
// @access       Private
router.put('/:id', authMiddleware, async (req, res) => {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).send("contact wasn't found!!");

    const joiCheck = validateContact(req.body);
    if (joiCheck.error) {
        const errors = joiCheck.error.details.map(err => err.message);
        return res.status(400).send(errors);
    }

    try {
        let { name, type, email, phone } = req.body;
        type = type || contact.type;
        phone = phone || contact.phone;
        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            {
                $set: { name, type, email, phone }
            },
            { new: true }
        );
        return res.json(contact);
    } catch (e) {
        console.error(e.message);
        return res.status(500).send('Server Error');
    }
});

// @route        GET /api/contacts/:id
// @desc         Get specified contact
// @access       Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findOne({ _id: req.params.id });
        if (!contact)
            return res
                .status(404)
                .send("the contact with this id wasn't found");
        res.json(contact);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route        DELETE /api/contacts/:id
// @desc         Delete contact
// @access       Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact)
            return res
                .status(404)
                .send("the contact with this id wasn't found");
        return res.json(contact);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
