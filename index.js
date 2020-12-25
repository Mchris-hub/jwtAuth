const express  = require("express");
const app      = express();
const mongoose = require("mongoose");
const authRoute = require('./routes/auth');
var bodyparser      =require("body-parser");



mongoose.connect("mongodb+srv://chris_243:60701997@cluster0.5sivj.mongodb.net/jwtAuth?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true },( ) =>{ console.log('connection succeded');})
app.set("view engine", "ejs");  

app.use(bodyparser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"this is it",
    resave:false,     
    saveUninitialized:false  
})); 

app.use('/api/user', authRoute);

app.listen(3000, ( ) => console.log("server running on port 3000"));