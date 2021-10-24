const router = require('express').Router();
const Users = require('../models/Users');
const bodyparser = require('body-parser');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { valid } = require('joi');
const jsonparser =require('express').json();

//DATA VALIDATION SCHEMA
const UserValidate = Joi.object({
    name: Joi.string().alphanum().required(),
    date_of_birth: Joi.date().max('12-31-2008').required(),
    gender: Joi.string().required(),
    phone_number: Joi.string().min(7).max(15),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } } ),
    username: Joi.string().required(),
    password: Joi.string().min(8).max(16).required(),


});

//TO REGISTER A NEW USER
router.post('/register',jsonparser,async (req,res) => {
    const { error } = UserValidate.validate(req.body);
    try{res.send(error.details[0].message);}
    catch(err){
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(req.body.password,salt);
        const users = new Users({
            name: req.body.name,
            date_of_birth: Date.parse(req.body.date_of_birth),
            gender: req.body.gender,
            phone_number: req.body.phone_number,
            email: req.body.email,
            username: req.body.username,
            password: hashpassword        
        });
        try{
            const savedUsers = await users.save();
            res.json(savedUsers);
            res.send("Registration Successful");
        }
        catch(err){
            res.json({message: err});
        }
    }
    
});

//TO LOGIN 
router.post('/login',jsonparser,async (req,res) => {
    console.log('Login initiated');
    try{
        const userexists = await Users.findOne({username: req.body.username});
        console.log(userexists.login);
    
    if(userexists){
        console.log('In if condition');
        const validuser = await bcrypt.compare(req.body.password,userexists.password);
        if(validuser){
        const secretword = 'qmngkpknngjgjdpqfkjcnjdskaskjduseiruhjdnvmlkdjdkfhgpoalxfmnbysdrialskdjcvngckmlxdfjcvkmmjhcvhyfudjsuhyfmkdjfhjvjndfhgbfiughvniufgdiughcfkldiuhmcsifjziusdhmfundsfiscmidffghndhfhvmsksdjfhuvnxmdfkvlseurfymhxserilfuhsdmlicdslkfynxsdifhspiodhvhsiousiosduhsiudhs';
        const token = jwt.sign({_id: userexists._id},secretword);
        res.json({login: "true",name:userexists.name,token: token});
        console.log("True");
        }
        else{
            res.json({login: "false",msg:"Invalid password"});
            console.log("False");
        }
    }
    else{
        console.log('In else condition');
        res.json({login: "false",msg: "Invalid user"})
    }
}
catch(err){
    console.log('In catch');
    console.log(err);
    res.send(err);
}
});


module.exports = router;