
module.exports = function(req, res, next) { 

    // 401: Unauthorized.. unable to call the API (e.g. invalid Json Web Token)
    // 403: Forbidden.. can call the API but unable to execute it because of permissions denied

    if (!req.user.isAdmin) return res.status(403).send('Forbidden');

    next();
}
