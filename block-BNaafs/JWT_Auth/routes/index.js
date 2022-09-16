var express = require('express');
var auth = require('../middlewares/auth');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard',auth.validateToken,(req,res) => {
  console.log(req.user);
  res.json({ access : "User loggedIn successful"})
});
module.exports = router;
