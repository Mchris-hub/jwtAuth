const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    const token = req.session.token;
   
    if(!token) {
        req.flash("error", "please login first")
        res.redirect("/login")
       
    }
    try{
        const verified = jwt.verify(token,"ibbibaibaiebfjaefbafb");
        req.user = verified;
        next();

    }catch(err){
        res.status(400).send('invalid token');
    }
}