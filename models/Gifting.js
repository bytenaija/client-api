const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const GiftingSchema = new Schema({
  
    number: {
        type: Number,
        required: true,
        default: 0
    },

    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },

    purpose: {
        type: String,
        required: true,
       
    },

    
    recepientName: {
        type: String,
        required: true,
       
    },

    
    recepientEmail: {
        type: String,
        required: true,
       
    },

    
    recepientPhoneNumber: {
        type: String,
        required: true,
       
    },

    
    recepientAddress: {
        type: String,
        required: true,
       
    },

        
    recepientAddress: {
        type: Boolean,
        required: true,
       default: 'Incomplete'
    }
}, {
    timestamps: true
})



module.exports =  mongoose.model('Gifting', GiftingSchema)