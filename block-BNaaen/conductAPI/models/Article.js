var mongoose = require("mongoose");
var slugger = require("slugger");

var Schema = mongoose.Schema;
var articleSchema = new Schema(
    {
        slug: { type: String, require: true, unique: true },
        title: { type: String, require: true },
        description: { type: String },
        body: { type: String },
        tagList: [String],
        favorite: [{ type: mongoose.Types.ObjectId }],
        favoritesCount: { type: Number, default: 0 },
        author: { type: Object, require: true },
        comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],

    },
    { timestamps: true },
);

articleSchema.pre("save", async function (next) {
    this.slug = slugger(this.title);
    next();
})

module.exports = mongoose.model("Article", articleSchema);