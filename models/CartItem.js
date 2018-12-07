const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    quantity: {
        type: Number,
        required: true,
    },

    cartId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Cart'
    },
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Product'
    },

}, {
    timestamps: true
})


module.exports = CartItem = mongoose.model('cartitems', CartItemSchema)