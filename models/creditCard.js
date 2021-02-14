const mongoose = require('mongoose');
var localpassmongoose=require("passport-local-mongoose");

const creditShema = new mongoose.Schema({
    creditcardNumber:{
        type:String,
    },
    creditcardExpiration:{
        type:String,
    },
    creditcardSignature:{
        type:String,
    },
    creditowner:{
        type:String,
    },
    creditpin:{
        type:String,
    }
})
creditShema.plugin(localpassmongoose);
module.exports = mongoose.model('creditCard', creditShema);