const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
    {
    acc_no: {type:Number,required:true,unique:true},    
    otp: {type:Number, required:true},
    },
    {
        timestamps:true,
    },
);
const Otp = mongoose.model('Otp',otpSchema);

module.exports = Otp;