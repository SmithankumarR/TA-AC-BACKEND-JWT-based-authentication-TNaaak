var express = require('express');
var User = require('../models/User');
var auth = require('../middlewares/auth');

var router = express.Router();

/* GET users listing. */
router.get('/', auth.isLoggedIn, function (req, res, next) {
  res.json('Welcome to BookStore');
});

// register
router.post('/register', async (req, res, next) => {
  var data = req.body;
  try {
    var user = await User.findOne({ email: data.email });

    // check for existing user
    if (user) {
      return res.json({ error: 'User already exits' });
    }
    if (!user) {
      var createdUser = await User.create(data);
      res.json({ user: createdUser });
    }
  } catch (error) {
    next(error);
  }
});

// login
router.post('/login', async (req, res, next) => {

  var{ email, password } = req.body;
  // no email or password
  if (!email || !password) {
    return res.json({ error: 'email/password required' })
  }
  var user = await user.findOne({ email });

  if (!user) {
    return res.json({ error: ' Email not registered yet' });
  }

  var result = await user.verifyPassword(password);
  if (!result) {
    return res.status(400).json({ error: "InCorrect Password" });
  }
  var token = await user.createToken();
  res.json({ user: user.userJson(token) })
})

module.exports = router;
