const mongoose = require('mongoose');

const ExerciseSet = require('./Set').Schema;

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  exerciseSets: {
    type: [ExerciseSet],
    required: true,
  },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
