var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var profileSchema = new Schema(
    {
        username: { type: String, unique: true },
        following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        bio: String,
        image: { type: String, default: null },
        user: { type: mongoose.Types.ObjectId, ref: "User" },
    }
)

module.exports = mongoose.model("Profile", profileSchema);