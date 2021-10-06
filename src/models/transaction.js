const mongoose = require('mongoose');

const transSchema = new mongoose.Schema(
    {
        fromaccount: {type: Number, required: true},
        toaccount: {type: Number, required: true},
        amount: {type:Number,required:true},
    },
);

const Transaction = mongoose.model('Transaction',transSchema);
module.exports = Transaction;
