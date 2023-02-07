const packetData = require('../models/data')
const Counts = require('../models/counts')

exports.getHome = (req, res, next) => {
    return res.json({ success: true, msg: "Hello" });
}

exports.getPackets = (req, res, next) => {
    packetData.find() // Fetch all documents 
        .then(data => {
            return res.json({ success: true, data: data });
        })
        .catch(err => {
            console.log("Error fetching packet data ", err);
            return res.json({ success: false, msg: "Error fetching packet data" });
        })
}

exports.getCounts = (req, res, next) => {
    Counts.find() // Fetch all documents 
        .then(data => {
            return res.json({ success: true, data: data });
        })
        .catch(err => {
            console.log("Error fetching counts data ", err);
            return res.json({ success: false, msg: "Error fetching counts data" });
        })
}

exports.getClear = (req, res, next) => {
    packetData.deleteMany({})
        .then(result => {

            Counts.deleteMany({})
                .then(result => {
                    return res.json({ success: true });
                })
                .catch(err => {
                    console.log("Error clearing data ", err);
                    return res.json({ success: false, msg: "Error clearing data" });
                })

        })
        .catch(err => {
            console.log("Error clearing data ", err);
            return res.json({ success: false, msg: "Error clearing data" });
        })
}