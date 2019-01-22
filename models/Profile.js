const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  
    gender: {
        type: String,
        required: false,
    
    },

    sender: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },

    profilePic: {
        type: String,
        required: false,
       
    },

    profession: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
})



module.exports =  mongoose.model('Profile', ProfileSchema)