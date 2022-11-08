//jshint esversion:6
const User = require("./model/User");
const Company = require("./model/Company");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register_user", function (req, res) {
  res.render("register_user");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/forgot_pass", function (req, res) {
  res.render("forgot_pass");
});

app.post("/sub", async function (req, res) {
  const user = new User({
    email: req.body.useremail,
    password: req.body.pass1,
    name: req.body.uname,
    country: req.body.nation,
    state: req.body.state,
    pincode: req.body.pin,
    mobile: req.body.mobno,
    experience: req.body.experience.value,
    skills: req.body.pass2,
    basic: req.body.ugcourse.value,
    master: req.body.pgcourse.value,
  });
  try {
    await user.save()
    res.redirect("login")
  } catch (err) {
    res.redirect("register_user")
  }
});

app.post("/emp", async function (req, res) {
  const user = new Company({
    email: req.body.email,
    password: req.body.pass1,
    compname: req.body.pass2,
    company: req.body.compname,
    type: req.body.comtype,
    industry: req.body.indtype.value,
    address: req.body.addr,
    pincode: req.body.pin_code,
    name: req.body.person,
    mobile: req.body.phone,
    about: req.body.about,
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to mongoose"));
