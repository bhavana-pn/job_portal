const md5 = require("md5");
const User = require("./model/User");
const Company = require("./model/Company");
const Job = require("./model/Job");
const JobApplication = require("./model/JobApplications");
const ObjectId = require('mongoose').Types.ObjectId;

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
app.get('/successfull_application', function (req, res) {
  res.render('successfull_application');
});

app.get("/postjob/:id", function (req, res) {
  console.log(req.params.id);
  //find company which has id = req.params.id
  Company.findById(req.params.id, function (err, company) {
    if (err) {
      console.log(err);
    } else {
      // log the company
      console.log(company);
      res.render("postjob", { company: company });
    }
  });
});

app.get('/viewpostedjob/:id', function(req, res){
  Job.find({ companyid: req.params.id }, function(err, job){
    if(err){
      console.log(err);
    }else{
      console.log('Found job in viewposted job: ',job);
      res.render('viewpostedjob', {job: job[0]});
    }
  });
});

app.get('/viewjobs/:id,:userid', function (req, res) {
  console.log("Entered viewjobs");
  console.log(req.params.id);
  //find job which has id = req.params.id
  Job.findById(req.params.id, function (err, job) {
    if (err) {
      console.log(err);
    } else {
      // log the job
      console.log(job);
      //find user with id = req.params.userid
      User.findById(req.params.userid, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          // log the user
          console.log(user);
          res.render("viewjobs", { job: job, user: user });
        }
      });
    }
  });
});

app.get('/applyjob/:jobid,:userid', function (req, res) {
  console.log("Entered applyjob");
  //find job which has id = req.params.jobid
  Job.findById(req.params.jobid, function (err, job) {
    if (err) {  
      console.log(err);
    } else {
      console.log(job);
      const job_application = new JobApplication({
        jobid: req.params.jobid,
        userid: req.params.userid,
        companyid: job.companyid,
        companyname: job.companyname,
        jobtitle: job.title,
      });
      job_application.save(function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/successfull_application');
        }
      });
    }
  });
});

app.post("/postjob", function (req, res) {
  const job = new Job({
    companyid: req.body.companyid,
    companyname: req.body.companyname,
    title: req.body.desig,
    description: req.body.jobdesc,
    no_of_vacancies: req.body.vacno,
    experience: req.body.exp,
    basic_pay: req.body.pay,
    functional_area: req.body.fnarea,
    location: req.body.location,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    industry: req.body.indtype,
    ug_qualification: req.body.ugcourse,
    pg_qualification: req.body.pgcourse,
    desired_candidate_profile: req.body.profile,
  });
  job.save(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      Company.findById(req.body.companyid, function (err, company) {
        if (err) {
          console.log(err);
        } else {
          // log the company
          console.log(company);
          res.render("postjob", { company: company });
        }
      });
    }
  });

});

app.post("/login", function (req, res) {
  const email = req.body.email;
  const password = md5(req.body.password);
  Company.find({ email: email, password: password }, function (err, company) {
    if (err) {
      console.log(err);
    } else {
      if (company.length > 0) {
        console.log(company);
        res.render("profile", { company: company });
      }
      else {
        User.find({ email: email, password: password }, function (err, user) {
          if (err) {
            console.log(err);
          } else {
            if (user.length > 0) {
              console.log(user);
              //get list of all jobs in array from db
              Job.find({}, function (err, jobs) {
                if (err) {
                  console.log(err);
                } else {
                  // log the company
                  console.log(jobs);
                  res.render("profile_user", { user: user, jobs: jobs });
                }
              });
            }
            else {
              res.render("login", { error: "Invalid Credentials" });
            }
          }
        });
      }
    }
  });

  // const foundUser = User.find({ email: email, password: password });
  // console.log(foundCompany);
  // console.log(foundUser);
  // if (foundCompany[0] != null) {
  //   res.render("profile", { company: foundCompany });
  // }
  // else if (foundUser[0] != null) {
  //   res.render("profile_user", { user: foundUser });
  // } else {
  //   res.render("login");
  // }
});

app.post("/sub", function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err != null) {
      res.render("register_user", {
        field: "email",
        error: "Email already exists, try logging in 😄",
      });
    }
    else if (req.body.pass1 == req.body.pass2) {
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
  // if (req.body.pass1 == req.body.pass2) {
  //   const user = new User({
  //     email: req.body.useremail,
  //     password: md5(req.body.pass1),
  //     name: req.body.uname,
  //     country: req.body.nation,
  //     state: req.body.state,
  //     pincode: req.body.pin,
  //     mobile: req.body.mobno,
  //     experience: req.body.experience,
  //     skills: req.body.pass2,
  //     basic: req.body.ugcourse,
  //     master: req.body.pgcourse,
  //   });

  //   // try {
  //   //   console.log("Inside Try Block")
  //   //   const newUser = await user.save()
  //   //   console.log("Try Block")
  //   //   res.redirect("login")
  //   // } catch (err) {
  //   //   console.log("Catch block")
  //   //   res.redirect("register_user")
  //   // }
  //   user.save((err, newUser) => {
  //     if (err) {
  //       res.render("register_user", {
  //         error: err,
  //         field: "",
  //       });
  //       console.log("Error " + err);
  //     } else {
  //       res.redirect("login");
  //     }
  //   });
  // } else {
  //   res.render("register_user", {
  //     field: "password",
  //     error: "Password does not match",
  //   });
  // }
});

app.post("/emp", function (req, res) {
  console.log("Inside emp");
  Company.findOne({ email: req.body.email }, function (err, company) {
    if (err != null) {
      res.render("register", {
        field: "email",
        error: "Email already exists, try logging in 😄",
      });
    }
    else if (req.body.pass1 == req.body.pass2) {
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
  console.log("After findOne");

  // if (req.body.pass1 == req.body.pass2) {
  //   const company = new Company({
  //     email: req.body.email,
  //     password: md5(req.body.pass1),
  //     company: req.body.compname,
  //     type: req.body.comtype,
  //     industry: req.body.indtype,
  //     address: req.body.addr,
  //     pincode: req.body.pin_code,
  //     name: req.body.person,
  //     mobile: req.body.phone,
  //     about: req.body.about,
  //   });
  //   console.log("Before save");
  //   company.save((err, newCompany) => {
  //     if (err) {
  //       console.log("Error " + err);
  //       res.render("register", {
  //         error: err,
  //         field: "",
  //       });
  //     } else {
  //       console.log("Before redirect to login");
  //       res.redirect("login");
  //     }
  //   });
  // } else {
  //   res.render("register", {
  //     field: "password",
  //     error: "Password does not match",
  //   });
  // }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to mongoose"));
