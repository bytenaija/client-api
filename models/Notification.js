const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  notification: {
    type: String,
    required: true,
  },

  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },

type: {
  type: String,
  required: true
}
}, {
  timestamps: true
})


module.exports = mongoose.model('Notification', NotificationSchema)