const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  emailConfirmed: {
    type: Boolean,
    required: true,
    default: false,
  },

  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
