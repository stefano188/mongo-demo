
module.exports = function (err, req, res, next) {
    // Log the exeption
    res.status(500).send('Something failed');
}
