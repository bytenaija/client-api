const mongoose = require('mongoose');
const Product = require('./Product')

const Schema = mongoose.Schema;

const SavedItemSchema = new Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },

    product: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Product'
    },

}, {
    timestamps: true
})


module.exports = mongoose.model('SavedItem', SavedItemSchema)