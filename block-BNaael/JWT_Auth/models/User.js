var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
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
        var result = await bcrypt.compare("password", this.password);
        return result;
    } catch (error) {
        return error;
    }
};

var User = mongoose.model('User', userSchema);

module.exports = User;
