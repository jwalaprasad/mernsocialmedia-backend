const router = require('express').Router();
const jwt = require('jsonwebtoken');
const verify = require('./verifytoken');
const Users = require('../models/Users');
const { route } = require('./Postroute');
const jsonparser = require('express').json();

router.post('/follow',verify,jsonparser,async (req,res) => {
    
    const userid = jwt.decode(req.header('auth-token'));
    console.log('Follow id is '+req.body.follow_id+' User id is '+userid._id);
    const currentupdate = {following:{id: String(req.body.follow_id)}};
    const followupdate = {followers:{id: userid._id}};
    await Users.updateMany({_id: userid},{$push: {following: String(req.body.follow_id)}});
    await Users.updateMany({_id:req.body.follow_id},{$push: {followers: userid._id}});
    res.send('Followed');   
});

router.post('/unfollow',verify,jsonparser,async (req,res,next) => {
    const userid = jwt.decode(req.header('auth-token'));
    console.log('Follow id is '+req.body.follow_id+' User id is '+userid._id);
    const currentupdate = {following:{id: String(req.body.follow_id)}};
    const followupdate = {followers:{id: userid._id}};
    await Users.updateMany({_id: userid},{$pull: {following: String(req.body.follow_id)}} );
    await Users.updateMany({_id:req.body.follow_id},{$pull: {followers: userid._id}});
});

router.post('/checkfollow',verify,jsonparser,async (req,res) => {
    const userid = req.body.follow_id;
    const myid = jwt.decode(req.header('auth-token'));
    const exists = await Users.exists({_id: userid,followers: myid._id});
    const resdata = {};
    resdata.exists = exists;
    res.send(resdata);
});

router.post('/checkuser',jsonparser,async (req,res) => {
    const email = req.body.email;
    const phonenumber = req.body.phonenumber;
    const username = req.body.username;
    const emailexists = await Users.exists({email: email});
    const phonenumberexists = await Users.exists({phone_number: phonenumber});
    const usernameexists = await Users.exists({username: username});
    const result = {};
    result.email = emailexists;
    result.phonenumber = phonenumberexists;
    result.username = usernameexists;
    console.log(result);
    res.send(result); 
});

router.get('/getusers',verify,jsonparser,async (req,res) =>{
    try{
        const users_id = await Users.find({},'_id name');
        Promise.all(users_id).then((users_id) => {
            var resultschema = '{"searchusers":[]}';
            var result = JSON.parse(resultschema);
            users_id.forEach(element => {
                result["searchusers"].push(element);
            });
            res.send(result)
        });
    }
    catch(err){
        res.send(err);
    }
});



router.post('/searchusers',verify,jsonparser,async (req,res) => {
    try{
        console.log(req.body);
        const search_name = req.body.search_name;
        const result = await Users.find({name: new RegExp(search_name,'i')},'_id name');
        // Promise.all(result).then((result) => {
        //     var resultschema = '{"searchusers":[]}';
        //     var searchresult = JSON.parse(resultschema);
        //     result.forEach(element => {
        //         searchresult["searchusers"].push(element);
        //     });
        //     res.send(searchresult)
        // });
        console.log(search_name);
        res.send(result);
    }
    catch(err){
        res.send(err);
    }
});




module.exports = router;
