const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
    acc_no: {type:Number,required:true,unique:true},    
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    nominee: { type: String, default: 'false', required: true },
    phoneno:{type:Number, required:true},
    },  
);
const User = mongoose.model('User',userSchema);

module.exports = User;