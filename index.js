


require('dotenv').config();
var express         =require("express");
var bodyparser      =require("body-parser");
var app             =express();
var mongoose        =require("mongoose");
var authRoute       =require("./routes/auth");

var User            =require("./models/user"); 
var passport        =require("passport");
var localStrategy   =require("passport-local");
var methodoverride  =require("method-override");

var flash           =require("connect-flash");

mongoose.connect("mongodb+srv://chris_243:60701997@cluster0.5sivj.mongodb.net/Theproject?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true },( ) =>{ console.log('connection succeded');})
app.set("view engine", "ejs");  

app.use(require("express-session")({
    secret:"this is it",
    resave:false,     
    saveUninitialized:false  
})); 
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(flash());
app.locals.moment=require('moment');
app.use(passport.initialize());
app.use(passport.session());
app.use(methodoverride("_method"));
 
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
        
app.use(function (req, res, next) {
    res.locals.currentUser=req.user; 
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
      
    next();
});    

app.use('/api/user', authRoute);

app.listen(3000, ( ) => console.log("server running on port 3000"));