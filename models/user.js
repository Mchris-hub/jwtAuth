const mongoose = require('mongoose');
var localpassmongoose=require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    surname:{
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    moneyInBank: {
        type: Number,
    },
    Address:{
        type:String,
    },
    phoneNumber:{
        type:String,
    }, 
    dateCreated:{
        type:Date,
        default:Date.now
    }, 
    myIdOrPassortNumber:{
       type:String,
    },
    blocked:false,
    limit:{
        type:String,
        default:"500"
    },
    creditCard:[{type:mongoose.Schema.Types.ObjectId,
        ref:"creditCard"}],
    withdrawals:[],
    raisons:[]
});

userSchema.plugin(localpassmongoose);
module.exports = mongoose.model('user', userSchema);