const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('no token, authorization denied');

    try {
        const decoded = jwt.verify(token, config.get('secret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).send(`token isn't valid, authorization denied`);
    }
};
