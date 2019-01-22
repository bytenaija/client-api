const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  
    gender: {
        type: String,
        required: true,
    
    },

    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },

    profilePic: {
        type: String,
        required: true,
       
    },

    
}, {
    timestamps: true
})



module.exports =  mongoose.model('Profile', ProfileSchema)