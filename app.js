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
  res.render("register_user", { field: "", error: "" });
});

app.get("/register", function (req, res) {
  res.render("register", { field: "", error: "" });
});

app.get("/forgot_pass", function (req, res) {
  res.render("forgot_pass");
});

app.get("/profile", function (req, res) {
  res.render("profile");
});

app.post("/login", async function (req, res) {
  const email = req.body.email;
  const password = md5(req.body.password);
  const foundCompany = await Company.find({ email: email, password: password });
  const foundUser = await User.find({ email: email, password: password });
  console.log(foundCompany);
  console.log(foundUser);
  if (foundCompany != null) {
    res.render("profile", { company: foundCompany });
  }
  else if (foundUser != null) {
    res.render("profile_user", { user: foundUser });
  } else {
    res.render("login");
  }
});

app.post("/sub", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!err) {
      res.render("register_user", {
        field: "email",
        error: "Email already exists, try logging in 😄",
      });
    }
  });

  if (req.body.pass1 == req.body.pass2) {
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
          error: err,
          field: "",
        });
        console.log("Error " + err);
      } else {
        res.redirect("login");
      }
    });
  } else {
    res.render("register_user", {
      field: "password",
      error: "Password does not match",
    });
  }
});

app.post("/emp", function (req, res) {
  console.log("Inside emp");
  Company.findOne({ email: req.body.email }, function (err, company) {
    if (!err) {
      res.render("register", {
        field: "email",
        error: "Email already exists, try logging in 😄",
      });
    }
  });
  console.log("After findOne");

  if (req.body.pass1 == req.body.pass2) {
    const company = new Company({
      email: req.body.email,
      password: md5(req.body.pass1),
      company: req.body.compname,
      type: req.body.comtype,
      industry: req.body.indtype,
      address: req.body.addr,
      pincode: req.body.pin_code,
      name: req.body.person,
      mobile: req.body.phone,
      about: req.body.about,
    });
    console.log("Before save");
    company.save((err, newCompany) => {
      if (err) {
        console.log("Error " + err);
        res.render("register", {
          error: err,
          field: "",
        });
      } else {
        console.log("Before redirect to login");
        res.redirect("login");
      }
    });
  } else {
    res.render("register", {
      field: "password",
      error: "Password does not match",
    });
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to mongoose"));
