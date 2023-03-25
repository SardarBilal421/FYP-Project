const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  message: {
    type: String,
  },
  sender: {
    type: String,
  },
  reciver: {
    type: String,
  },
  stamp: {
    type: String,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
