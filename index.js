const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app=express();
const router = require('./router');
const mongoose = require('mongoose');

//DB setup
const url = process.env.DATABASEURL || 'mongodb://localhost/auth'
mongoose.connect(url,{useMongoClient:true})
const db=mongoose.connection
db.once('open',()=>{
  console.log('Connected to database');
})

//app setup
app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);

//server setup
const port = process.env.PORT || 8080;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:'+port);
