const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const AddressSchema = new Schema({

    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
  
    address:{
        type:String,
        required: true
    },
    city:{
        type:String,
        required: true
    },
    state:{
        type:String,
        required: true
    },
    country:{
        type:String,
        required: true
    },
    phoneNumber: {
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    default:{
        type:Boolean,

    },
})


module.exports =  mongoose.model('Address', AddressSchema)