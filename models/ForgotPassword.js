const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const ForgotPasswordSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  
  code: {
    type: String,
    required: true
  },
  

}, {
  timestamps: true
})



module.exports = mongoose.model('ForgotPassword', ForgotPasswordSchema)