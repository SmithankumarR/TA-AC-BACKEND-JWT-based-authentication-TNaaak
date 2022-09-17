var jwt = require('jsonwebtoken');

module.exports = {
  validateUser: async function (req, res, next) {
    let token = req.headers.authorization;

    try {
      if (token) {
        var payload = await jwt.verify(token, process.env.SECRET);

        req.users = payload;
        next();
      } else {
        res.status(400).json({ error: 'token required' });
      }
    } catch (error) {
      next(error);
    }
  },
};
