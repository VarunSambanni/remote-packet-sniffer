const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')


const routes = require('./routes/routes')

MONGODB_URI = 'INSERT MONGO URI'

const app = express(); // Express app intialized, on this app we will perform things 

app.use(express.urlencoded({ extended: true })); // app.use('middleware function')
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
