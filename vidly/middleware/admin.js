
module.exports = function(req, res, next) { 

    // 401: Unauthorized.. unable to call the API
    // 403: Forbidden.. can call the API but unable to execute it

    if (!req.user.isAdmin) return res.status(403).send('Forbidden');

    next();
}
