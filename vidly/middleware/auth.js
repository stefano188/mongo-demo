
const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided');

    try {
        const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedToken;
        // console.log('middleware auth decoded token', req.user);
        next();
    } catch (ex) {
        res.status(400).send('Invalid token');
    }
}

module.exports = auth;
