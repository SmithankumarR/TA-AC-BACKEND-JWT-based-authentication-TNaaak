var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    title: String,
    description: String,
    categories: [String],
    tags: [String],
    price: [Number],
    quantity: [Number],
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    comments: { type: mongoose.Types.ObjectId, ref: 'Comment' },
}, {
    timestamps: true,
})

var Book = mongoose.model('Book', bookSchema);
module.exports = Book;