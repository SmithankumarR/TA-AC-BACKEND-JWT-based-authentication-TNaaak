var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

// hash password

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// verify password

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
    let token = jwt.sign(payload, process.env.SECRET);
    console.log('token', token);
    return token;
  } catch (error) {
    return error;
  }
};
// userJson required data
userSchema.methods.userJson = function(token) {
  return {
    name :this.name,
    email: this.email,
    token:token,
  }
}
var User = mongoose.model('User', userSchema);

module.exports = User;
