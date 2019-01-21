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

    
    recipientName: {
        type: String,
        required: true,
       
    },

    
    recipientEmail: {
        type: String,
        required: true,
       
    },

    
    recipientPhoneNumber: {
        type: String,
        required: true,
       
    },

    
    recipientAddress: {
        type: String,
        required: true,
       
    },

        
    status: {
        type: String,
        required: true,
       default: 'Incomplete'
    }
}, {
    timestamps: true
})



module.exports =  mongoose.model('Gifting', GiftingSchema)