const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/aimers').then(() => {
    console.log('successfully connected to the database!');
}).catch((e) => {
    console.log('connection failed');
});

