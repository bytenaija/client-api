const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    quantity: {
        type: Number,
        required: true,
    },

    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Product'
    },

}, {
    timestamps: true
})


module.exports = mongoose.model('CartItem', CartItemSchema)