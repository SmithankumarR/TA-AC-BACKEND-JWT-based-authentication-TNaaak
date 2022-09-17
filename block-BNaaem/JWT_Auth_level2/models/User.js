var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    books: { type: mongoose.Types.ObjectId, ref: 'Book' },
    comments: { type: mongoose.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

//hashed password
userSchema.pre('save', async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

//check correct password
userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

// create a token
userSchema.methods.createToken = async function () {
  var payload = {
    name: this.name,
    email: this.email,
  };

  try {
    var token = await jwt.sign(payload, process.env.SECRET);
    return token;
  } catch (error) {
    return error;
  }
};
// required Json data
userSchema.methods.userJson = function (token) {
  return {
    name: this.name,
    email: this.email,
    token: token,
  };
};

var User = mongoose.model('User', userSchema);

module.exports = User;
