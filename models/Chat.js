const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    chat_content: {
      type: String,
      required: true
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now()
    }
  });
  
  module.exports = mongoose.model('Chats',ChatSchema);