const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../middleware/auth');

const { User, validateUserLogin, hashPassword } = require('../models/User');

// @route        GET /api/auth
// @desc         get logged in user
// @access       Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route        POST /api/auth
// @desc         Auth user & get token
// @access       Public
router.post('/', async (req, res) => {
    let { email, password } = req.body;

    // validate the request body
    const joiCheck = validateUserLogin(req.body);
    if (joiCheck.error)
        return res.status(400).json('Invalid Email or Password');

    // check if user exists
    const isUserExist = await User.findOne({ email });
    if (!isUserExist) return res.status(400).send('Invalid Email or Password');

    // hash password
    password = await hashPassword(password);
    const checkPasswordMatch = bcryptjs.compare(password, isUserExist.password);
    if (!checkPasswordMatch)
        return res.status(400).send('Invalid Email or Password');

    try {
        jwt.sign(
            {
                user: {
                    id: isUserExist.id
                }
            },
            config.get('secret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) return err;
                return res.send({ token });
            }
        );
    } catch (err) {
        console.log(err.message);
        return res.status(500).send('Server Error');
    }
});

module.exports = router;
