var express = require('express');
var User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json('Hello Welcome to JWT based Authentication Section');
  next();
});

// register handler
router.post('/register', async (req, res, next) => {

  try {
    var user = await User.create(req.body);
    console.log(user);
    res.status(201).json({ user });
  }
   catch(error) {
    next(error);
  }
});

// login handler

router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;

  // no email or password
  if (!email || !password) {
    return res.status(400).json({ error: 'Email / password required' });
  }

  // check for user
  try {
    var user = await User.findOne({ email });
    // check whether credentials match
    if (!user) {
      return res.status(400).json({ error: ' Email not Registered Yet' });
    }
    var result = await user.verifyPassword(password);
    console.log(user, result);

    // check for password
    if (!result) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    return res.status(200).json({ Msg: "Logged IN Successful"})
  } catch (error) {
    next(error);
  }
});

module.exports = router;
