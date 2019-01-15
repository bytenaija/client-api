const mongoose = require('mongoose');
const User = require('./User'),
Cart = require('./Cart'),
Address = require('./Address')

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    status: {
        type: String,
        required: true,
        default: 'Unpaid'
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
    tax: {
        type: Number,
        required: true,
        
    },

    totalCost: {
        type: Number,
        required: true,  
    },
    reference: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


module.exports =  mongoose.model('Order', OrderSchema)