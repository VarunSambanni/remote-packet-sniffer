const mongoose = require('mongoose')

const Schema = mongoose.Schema

const dataSchema = new Schema({
    layers: [  // Array of layers 
        {
            type: String
        }
    ],
    timeStamp: {
        type: String
    },
    packet: {
        type: String
    },
    packetData: {
        type: String
    }
})

module.exports = mongoose.model('packet', dataSchema);

