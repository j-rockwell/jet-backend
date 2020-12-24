const mongoose = require('mongoose');

const Exercise = require('./Exercise').Schema;

const SessionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  exercises: {
    type: [Exercise],
    required: false,
  },

  active: {
    type: Boolean,
    required: true,
    default: false,
  },

  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model('Session', SessionSchema);
