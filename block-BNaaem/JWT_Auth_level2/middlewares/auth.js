var jwt = require('jsonwebtoken');

module.exports = {
    isLoggedIn: async function (req, res, next) {
        var token = req.headers.authorization;
        // check for token
        if (!token) {
            return res.status(400).json({ error: 'No User Present ,Register and try again' });

        } else {
            try {
                var payload = await jwt.verify(token, process.env.SECRET)
                req.user = payload;
                next();
            }
            catch (error) {
                next(error);
            }
        }
    }
};