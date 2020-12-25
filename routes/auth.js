const router = require('express').Router();
const User = require("../models/user");
const {loginValidation, registerValidation } = require('./validation');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const authorisation = require('./authorisation');

router.get('/', (req, res)=>{
    res.render("../views/register.ejs");
})
router.post('/register', async (req, res) => {
         
    console.log( req.body.email + + req.body.password );

        const {error} = await registerValidation(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        const userExist = await User.findOne({email: req.body.email },(error, foundUser) =>{} );
        if(userExist) return res.status(400).send("user already registered");
         
        const mungwa = await bcrypt.genSalt(10);
        const hashPassowrd = await bcrypt.hash(req.body.password, mungwa);

        const user = new User({
        name:req.body.username,
        email:req.body.email,
        password:hashPassowrd
    });
    try{
        const savedUser = await user.save();
        res.redirect('login');
    } catch(err){
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


module.exports = router;