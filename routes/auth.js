const { loginValidation, registerValidation } = require('./validation');
const authorisation                           = require('./authorisation');
const router                                  = require('express').Router();
const User                                    = require("../models/user");
const jwt                                     = require("jsonwebtoken");
const bcrypt                                  = require('bcrypt');
const creditcard                              =require("../models/creditCard");
const user = require('../models/user');
router.get('/', (req, res)=>{
    res.render("../views/register.ejs");
})
router.post('/register', async (req, res) => {
         
        //console.log( req.body.email + + req.body.password );

        const {error} = await registerValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const userExist = await User.findOne( {email: req.body.email }, (error, foundUser) =>{} );
        if(userExist) return res.status(400).send("user already registered");
         
        const mungwa = await bcrypt.genSalt(10);
        const hashPassowrd = await bcrypt.hash(req.body.password, mungwa);
        
        var amount = [ 10000,
            20000,
            30000,
            40000,
            50000,
            60000,
            70000,
            80000,
            90000,
            100000
                 ];
      var money=   amount[ Math.floor(Math.random() * (10 - 1) + 1)];
      var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');
   
      //creditcard expiration date
      var year=date.slice(0,4);
      var newYear=parseInt(year) +3;
      var month=date.slice(5,7);
      var Expired = month+'/'+newYear;
   
       // creditcard number
      var firstfours=  Math.floor(Math.random() * (9999 - 1111) + 1111) ;
      var secondfours= Math.floor(Math.random() * (9999 - 1111) + 1111); 
      var thirdfours= Math.floor(Math.random() * (9999 - 1111) + 1111);
       var lastfours =Math.floor(Math.random() * (9999 - 1111) + 1111);
      var creditnumber=firstfours.toString() + secondfours.toString() + thirdfours.toString() + lastfours.toString();
      
      //creditcard signature
      var creditSignature=  Math.floor(Math.random() * (999999 - 111111) + 111111) ;
      //creditcardowner
      var owner=req.body.name.slice(0,1).toUpperCase() + " " + req.body.surname.toUpperCase();
     // pin 
     var pin=  Math.floor(Math.random() * (9999 - 1111) + 1111) ;
   

        const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashPassowrd,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        myIdOrPassortNumber: req.body.myIdOrPassortNumber,
        
    });
    const credits={
        creditcardNumber :creditnumber,
        creditcardExpiration : Expired,
        creditcardSignature : creditSignature,
        creditowner : 'MR/MRS/Miss ' + owner,
        creditpin : pin
    }
    const creditcards= creditcard.create(credits, (error, comment)=>{})
    user.moneyInBank = money;
    user.creditcard.push(creditcards);
        
    try {
        const savedUser = await user.save();
        res.redirect('login');
    } catch(err) {
        res.status(400).send(err);
    }
    
    
    
    
    // res.send("register");
});
router.post("/login", async (req, res)=>{
     const {error} = await loginValidation(req.body);
    // console.log(req.body.email);
     if(error) return res.status(400).send(error.details[0].message);
     
     const user = await User.findOne({email: req.body.email});
     if(!user) return res.status(400).send("Email  is not found");

     const validPass = await bcrypt.compare(req.body.password, user.password);
     if(!validPass) return res.status(400).send('Invalid Passsword');

     const token= jwt.sign({_id: user._id},"ibbibaibaiebfjaefbafb");
     req.session.token=token;
     res.status(200).redirect('home');

     
});
router.get('/logout', (req, res, next)=>{
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('login');
          }
        });
      }
});

router.get('/login', (req, res) =>{
    res.render('../views/login.ejs');
});

router.get('/home',authorisation,(req, res)=>{
    
     User.findById( req.user._id, (err, user)=>{
        if (!user) {
            console.log("user not found");
        } else {
            //console.log(user);
            res.render('../views/home.ejs',{user: user});
        }
     });
    
});
router.get('/update',authorisation,(req, res)=>{
    User.findById( req.user._id, (err, user)=>{
        if (!user) {
            console.log("user not found");
        } else {
            //console.log(user);
            res.render('../views/update.ejs',{user: user});
        }
     });

});
router.get('/sendmoney',authorisation,(req, res)=>{
    User.findById( req.user._id, (err, user)=>{
        if (!user) {
            console.log("user not found");
        } else {
            //console.log(user);
            res.render('../views/sendMoney.ejs',{user: user});
        }
     });

});
router.get('/block',authorisation,(req, res)=>{
    User.findById( req.user._id, (err, user)=>{
        if (!user) {
            console.log("user not found");
        } else {
            //console.log(user);
            res.render('../views/block.ejs',{user: user});
        }
     });

});
router.get('/transHistory',authorisation,(req, res)=>{
    User.findById( req.user._id, (err, user)=>{
        if (!user) {
            console.log("user not found");
        } else {
            //console.log(user);
            res.render('../views/transHistory.ejs',{user: user});
        }
     });
});
router.put('/block',authorisation,(req, res)=>{
    var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

    var year=date.slice(0,4);
    var newYear=parseInt(year) +3;
    var month=date.slice(5,7);
    var Expired = month+'/'+newYear;
 
     // creditcard number
    var firstfours=  Math.floor(Math.random() * (9999 - 1111) + 1111) ;
    var secondfours= Math.floor(Math.random() * (9999 - 1111) + 1111); 
    var thirdfours= Math.floor(Math.random() * (9999 - 1111) + 1111);
    var lastfours =Math.floor(Math.random() * (9999 - 1111) + 1111);
    var creditnumber=firstfours.toString() + secondfours.toString() + thirdfours.toString() + lastfours.toString();
    
    //creditcard signature
    var creditSignature=  Math.floor(Math.random() * (999999 - 111111) + 111111) ;
    //creditcardowner
    var owner=req.body.name.slice(0,1).toUpperCase() + " " + req.body.surname.toUpperCase();
   // pin 
   var pin=  Math.floor(Math.random() * (9999 - 1111) + 1111);
   const credits={
    creditcardNumber :creditnumber,
    creditcardExpiration : Expired,
    creditcardSignature : creditSignature,
    creditowner : 'MR/MRS/Miss ' + owner,
    creditpin : pin
}

   creditcard.findByIdAndUpdate(req.user.creditCard._id,credits,(error,updated)=>{})
   user.findById(req.user._id,(error,founduser)=>{
        const data={
            date: new Date().toJSON().slice(0,10).replace(/-/g,'/'),
            raisons: req.body.raisons
        }
       founduser.raisons.push(data);
   })

})
router.put("/update",(req, res)=>{
    user.findByIdAndUpdate(req.user._id,{limit: req.body.amount},(req, res)=>{})
    
})
router.post("sendmoney",(req, res)=>{
    const body={
        name          :req.body.name,
        account       :req.body.account,
        amount        :req.body.amount,
        reference     :req.body.reference,
        exampleRadios :req.body.exampleRadios,
        date          : new Date().toJSON().slice(0,10).replace(/-/g,'/')
    };
    const id = req.user._id;
   const user= User.findById(id,(error, user)=>{});
   user.withdrawals.push(body);
   try {
       user.save();
       res.redirect("/sendmoney");
       req.flash("succcess", "transaction successful")
       
   } catch (error) {
       req.flash("error", "please login first")
       res.redirect("/sendmoney")
   }
})


module.exports = router;