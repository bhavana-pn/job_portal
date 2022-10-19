//jshint esversion:6
// if(process.env.NODE_ENV !== 'production'){
//   reuire('dotenv').config();
// }

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const mongoose = require("mongoose");
// mongoose.connect();

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("index");
})

app.get("/login", function(req, res){
  res.render("login");
})

app.get("/register_user", function(req, res){
  res.render("register_user");
})

app.get("/register", function(req, res){
  res.render("register");
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});