var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema(
    {
        author: { type: Object, require: true },
        body: { type: String, require: true },
        article: { type: mongoose.Types.ObjectId, ref: 'Article' },

    },
    { timestamps: true },
);

module.exports = mongoose.model("Comment", commentSchema);
