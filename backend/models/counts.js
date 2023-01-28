const mongoose = require('mongoose')

const Schema = mongoose.Schema

const countsSchema = new Schema({
    counts: [  // Array of layers 
        {
            type: Number
        }
    ],
    time: {
        type: Number
    }
})

module.exports = mongoose.model('count', countsSchema);