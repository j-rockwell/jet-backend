const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    key: {
        type: String,
        required: true
    },

    dateCreated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Token', TokenSchema);