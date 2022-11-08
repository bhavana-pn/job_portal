const md5 = require("md5");
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
  res.render("register_user", { user: new User(), error: "" });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/forgot_pass", function (req, res) {
  res.render("forgot_pass");
});

app.post("/sub", function (req, res) {
  console.log(req.body);
  const user = new User({
    email: req.body.useremail,
    password: md5(req.body.pass1),
    name: req.body.uname,
    country: req.body.nation,
    state: req.body.state,
    pincode: req.body.pin,
    mobile: req.body.mobno,
    experience: req.body.experience,
    skills: req.body.pass2,
    basic: req.body.ugcourse,
    master: req.body.pgcourse,
  });
  // try {
  //   console.log("Inside Try Block")
  //   const newUser = await user.save()
  //   console.log("Try Block")
  //   res.redirect("login")
  // } catch (err) {
  //   console.log("Catch block")
  //   res.redirect("register_user")
  // }
  user.save((err, newUser) => {
    if (err) {
      res.render("register_user", {
        user: user,
        error: err,
      });
      console.log("Error " + err);
    } else {
      res.redirect("login");
    }
  });
});

app.post("/emp", async function (req, res) {
  const company = new Company({
    email: req.body.email,
    password: req.body.pass1,
    compname: req.body.pass2,
    company: req.body.compname,
    type: req.body.comtype,
    industry: req.body.indtype,
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
