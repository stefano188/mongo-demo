
module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        } catch (ex) {
            // pass the control to the next middleware function
            // defined in index.js after all the other call to middleware functions
            next(ex);
        }
    };
}
