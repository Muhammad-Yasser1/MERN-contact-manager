const express = require('express');
const router = express.Router();

// @route        GET /api/contacts
// @desc         get logged in user contacts
// @access       Private
router.get('/', (req, res) => {
    res.send('get logged in user contacts');
});

// @route        POST /api/contacts
// @desc         Add a new Contact
// @access       Private
router.post('/', (req, res) => {
    res.send('add new contact');
});

// @route        PUT /api/contacts/:id
// @desc         Update contact
// @access       Private
router.put('/:id', (req, res) => {
    res.send('update contact');
});

// @route        DELETE /api/contacts/:id
// @desc         Delete contact
// @access       Private
router.put('/:id', (req, res) => {
    res.send('delete contact');
});

module.exports = router;
