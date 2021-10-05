const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
    acc_no: {type:Number,required:true,unique:true},    
    name: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    Nominee: { type: String, default: 'false', required: true },
    phone:{type:Number, required:true},
    balance:{type:Number, required:true},
    limit:{type:Number, required:true,default:0},
    image:{type:String,required:true},
    nomImage:{type:String, required:false}
    },
    {
        timestamps: true,
    }, 
);
const User = mongoose.model('User',userSchema);

module.exports = User;