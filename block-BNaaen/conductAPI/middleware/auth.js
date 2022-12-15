var jwt = require('jsonwebtoken');

module.exports = {
    isLoggedIn: async function (req, res, next) {
        try {
            var token = req.headers.authorization;

            if (!token) {
                return res.status(400).json({ error: "User must be logged in" });
            }
            else {
                var profileData = await jwt.verify(token, process.env.SECRET);
                req.user = profileData;
                next();
            }
        } catch (error) {
            next(error);
        }
    }
};