let jwt = require('jsonwebtoken');

module.exports = {
  validateToken: async function (req, res, next) {
    var token = req.headers.authorization;

    try {
      if (token) {
        let payload = await jwt.verify(token, process.env.SECRET);
        req.user = payload;
        return next();
      } else {
        res.status(400).json({ error: 'token required' });
      }
    } catch (error) {
      next(error);
    }
  },
};