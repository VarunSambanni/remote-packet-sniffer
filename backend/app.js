const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const routes = require('./routes/routes')

MONGODB_URI = 'mongodb+srv://adminUser:12345@remote-packet-sniffer.polt4sw.mongodb.net/packets?retryWrites=true&w=majority'

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(routes);

mongoose.connect(MONGODB_URI)
    .then(result => {
        console.log("Connected to database");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server listening on port ...${5000}`);
        })
    })
    .catch(err => {
        console.log("Database connection error => ", err);
    })