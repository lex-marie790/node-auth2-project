function makeCheckRoleMiddleware(role) {
    return function(req, res, next) {
        if (req.decodedJwt.role && req.decodedJwt.role === role) {
            next();
        } else {
            res.status(403).json({
                message: 'You dont have access to this...go away'
            });
        }
    };
};

module.exports = makeCheckRoleMiddleware;