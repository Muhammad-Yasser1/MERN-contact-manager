const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { User, validateUserRegister, hashPassword } = require('../models/User');

// @route        POST /api/users
// @desc         Register a user
// @access       Public
router.post('/', async (req, res) => {
    let { name, email, password } = req.body;

    // validate the request body
    const joiCheck = validateUserRegister(req.body);
    if (joiCheck.error) {
        const errors = joiCheck.error.details.map(err => err.message);
        return res.status(400).json(errors);
    }

    // check if user exists
    const isUserExist = await User.findOne({ email });
    if (isUserExist) return res.status(400).send('this email already exist');

    // hash password
    password = await hashPassword(password);

    //create new user
    try {
        const user = new User({
            name,
            email,
            password
        });
        user.save();

        // get token
        jwt.sign(
            { user: { id: user.id } },
            config.get('secret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) return err;
                return res.json({ token });
            }
        );
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
