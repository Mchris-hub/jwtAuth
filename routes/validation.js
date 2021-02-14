const joi = require("joi");

const registerValidation = (data) =>{
const schema = joi.object({
    name: joi.string() 
             .required(),
    surname: joi.string()
             .required(),
    email: joi.string()
              .min(6) 
              .required()
              .email(),
    password: joi.string() 
              .required(),
    address: joi.string() 
                 .required(),
    phoneNumber: joi.string() 
                 .min(10)
                 .required(),
    myIdOrPassortNumber: joi.string() 
                 .required()
                 
});
   
   return schema.validate(data);
};

const loginValidation = (data) =>{
    const schema = joi.object({
      
      email: joi.string().min(6).required().email(),
      password: joi.string().min(6).required()
  });
    
   return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;