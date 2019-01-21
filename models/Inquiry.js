const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const InquirySchema = new Schema({
  
    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },

    email: {
        type: String,
        required: true,
       
    },

    
    subject: {
        type: String,
        required: true,
       
    },

    
    message: {
        type: String,
        required: true,
       
    },

            
    status: {
        type: String,
        required: true,
       default: 'unanswered'
    }
}, {
    timestamps: true
})



module.exports =  mongoose.model('Inquiry', InquirySchema)