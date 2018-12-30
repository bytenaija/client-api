const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    status: {
        type: String,
        required: true,
    },

    cartId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Cart'
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    addressId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Address'
    },
    reference: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


module.exports = Order = mongoose.model('orders', OrderSchema)