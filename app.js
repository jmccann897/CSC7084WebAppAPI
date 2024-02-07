const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config({path: './config.env'});
const dashrouter = require('./routes/dashroutes');
const userrouter = require('./routes/userroutes');


const app = express();

app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/', dashrouter);
app.use('/dash', userrouter);

app.listen(process.env.PORT, (err) =>{
    if (err) return console.log(err);

    console.log(`Express API listening on port ${process.env.PORT}`);
});