const router = require("express").Router();
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const verify = require("./verifytoken");
const Posts = require("../models/Posts");
const Users = require("../models/Users");
const formidable = require('formidable');
// const multer = require('multer');
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now()+'.jpg')
//     }
//   })
// var upload = multer({ storage: storage });
const { func } = require("joi");
const { count } = require("../models/Posts");
const { default: uploadfile } = require("./firestorage");
const jsonparser = require('express').json();

router.post("/addpost", verify, jsonparser, async (req, res) => {
  const userid = jwt.decode(req.header("auth-token"));
  const post = new Posts({
    post_title: req.body.post_title,
    author_id: userid,
    post_image: req.body.post_image
  });
  console.log(req.body);
  try {
    await post.save();
    res.json(post);
  } catch (err) {
    res.json({ message: err });
  }
  // console.log(req.body.test);
});



router.post("/addpostphoto", verify, jsonparser, async (req, res) => {
  // console.log('Incoming');
  // const userid = jwt.decode(req.header("auth-token"));
  // const post = new Posts({
  //   post_title: req.body.post_title,
  //   post_body: req.body.post_body,
  //   author_id: userid,
  // });
  // try {
  //   await post.save();
  //   res.json(post);
  //   console.log("Success");
  // } catch (err) {
  //   console.log(err);
  //   res.json({ message: err });
  // }
  
});

router.get("/feed", verify, jsonparser, async (req, res, next) => {
  const userid = jwt.decode(req.header('auth-token'));
    const follow = await Users.findById(userid, "following").lean(true);
      if (follow.following) {
    const followss = follow.following;
    // console.log(followss);
    // res.send(followss);
    var posts = await followss.map(async (item) => {
      const eachpost = await Posts.find({ author_id: item.id })
        .populate("author_id")
        .lean(true);
      console.log(eachpost);
      return eachpost;
    });
    Promise.all(posts)
      .then((posts) => {
        // console.log(posts);
        // console.log(req.header("auth-token"));
        var tempresult = '{"posts":[]}';
        var result = JSON.parse(tempresult);
        posts.forEach((item) => {
          item.forEach((value) => {
            result["posts"].push(value);
          });
        });
        console.log(follow);
        res.send(result);
      })
      .catch((err) => {
        console.log('Error occurred!!!');
        res.send(err);
      });
  } else {
    res.send("No followers");
  }
 
});

router.post("/getposts",verify,jsonparser,async (req,res,next) => {
  console.log('MyFeed is '+req.body.myfeed);
  console.log('UserId is '+req.body.userid);
  console.log(req.body.userid);
  const myid = jwt.decode(req.header('auth-token'));
  const resdata = {};
  const userid = (req.body.myfeed === true) ? jwt.decode(req.header('auth-token')) : req.body.userid;
  const posts = await Posts.find({ author_id: userid }).lean(true);
    // console.log(posts);
    resdata.posts = posts;
    console.log(resdata);
    res.send(resdata);
});


router.put("/update", verify, jsonparser, async (req, res) => {
  const userid = jwt.decode(req.header("auth-token"));
  let reqtype = req.body.reqtype;
  let postid = req.body.postid;
  let post_title = req.body.post_title;
  let post_body = req.body.post_body;
  console.log(reqtype);
  console.log(postid);
  try {
    if (reqtype == "delete") {
      await Posts.deleteOne({ _id: postid });
      res.send("Post deleted");
    } else if (reqtype == "update") {
      if (post_title != undefined && post_body != undefined) {
        await Posts.updateOne(
          { _id: postid },
          { post_title: post_title, post_body: post_body }
        );
        res.send("Post updated!");
      } else if (post_title != undefined && post_body == undefined) {
        await Posts.updateOne({ _id: postid }, { post_title: post_title });
        res.send("Post updated!");
      } else if (post_title == undefined && post_body != undefined) {
        await Posts.updateOne({ _id: postid }, { post_body: post_body });
        res.send("Post updated!");
      } else {
        res.send("Invalid request!!!");
      }
    } else {
      res.send("Invalid request!!!");
    }
  } catch (err) {
    res.send(err);
  }
});

router.post('/likepost',verify,jsonparser,async (req,res) => {
  const userid = jwt.decode(req.header("auth-token"));
  const postid = req.body.post_id;
  const likeactivity = req.body.likeactivity;
  if(likeactivity === "like"){
    await Posts.findByIdAndUpdate(postid,{$push: {liked_id:userid}}).then((result) => {
      console.log(result);
      console.log('Liked');
      res.send('Successfully liked');
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  }
  else if(likeactivity === "unlike"){
    await Posts.findByIdAndUpdate({_id: postid},{$inc: {likes:-1},$pull: {likedby: String(userid)}}).then((result) => {
      console.log('Unliked');
      res.send('Successfully unliked');
    }).catch((err) => {
      console.log(err);
      res.send(err);
    });
  }
});



module.exports = router;
