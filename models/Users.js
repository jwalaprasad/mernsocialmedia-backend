const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phone_number: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  followers: {
    id:{
      type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }}
  },
  following: {
    id:{type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }}
  },
  timestamp: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model('Users',UserSchema);
