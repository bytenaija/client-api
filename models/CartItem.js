const mongoose = require('mongoose');
const Product = require('./Product')

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

    cartId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Cart'
    },

}, {
    timestamps: true
})


module.exports = mongoose.model('CartItem', CartItemSchema)