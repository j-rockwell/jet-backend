const mongoose = require('mongoose');

const ExerciseSet = new mongoose.Schema({
    reps: {
        type: Number,
        required: false
    },

    weight: {
        type: Number,
        required: false
    },

    duration: {
        type: Number,
        required: false
    }
});

module.exports = mongoose.model('ExerciseSet', ExerciseSet);