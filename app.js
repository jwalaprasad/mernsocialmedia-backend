const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

//IMPORT ROUTES
const UserAuth = require('./routes/UserAuth');
const PostRoute = require('./routes/Postroute');
const ActivityRoute = require('./routes/Activity');

const app = express();

//HANDLING CORS
app.use(cors());

//USE ROUTES
app.use('/auth',UserAuth);
app.use('/posts',PostRoute);
app.use('/activity',ActivityRoute);

//USE MIDDLEWARES
app.use(bodyparser.json());


//CONNECT TO THE DATABASE
mongoose.connect(process.env.MONGODB_URL,{ useNewUrlParser: true },() => console.log('Connected to DB!!!'));

app.get('/',(req,res) => {
    res.send('Homepage');
});

app.listen(5000);