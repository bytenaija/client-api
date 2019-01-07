const mongoose = require('mongoose');
const CartItem = require('./CartItem')
const User = require('./User')

const Schema = mongoose.Schema;

const CartSchema = new Schema({
    totalCost: {
        type: Number,
        required: true,
    },
   
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
  
    status:{
        type:String,
        required: true,
        default: 'Uncomplete'
    },

    cartItems: [{ type: Schema.Types.ObjectId, ref: 'CartItem' }]

}, {
    timestamps: true
})


CartSchema.pre('remove', function(next) {
    CartItem.remove({cartId: this._id}).exec();
    next();
});

module.exports = mongoose.model('Cart', CartSchema)