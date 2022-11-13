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

app.post("/deletejob", function (req, res) {
  Job.deleteOne({ _id: req.body.jobid }, function (err) {
    if (err) {
      console.log(err);
    } else {
      JobApplication.deleteMany({ jobid: req.body.jobid }, function (err) {
        if (err) {
          console.log(err);
        } else {
          Company.findById(req.body.companyid, function (err, company) {
            if (err) {
              console.log(err);
            } else {
              res.render("profile", { company: company });
            }
          });
        }
      });
    }
  });
});
app.post('/accept_job', function (req, res) {
  JobApplication.updateOne({ _id: req.body.jobappid }, { status: 'Accepted' }, async function (err) {
    if (err) {
      console.log(err);
    } else {
      jobapps = await JobApplication.find({ companyid: req.body.companyid });
      console.log('Found jobapp in managejob: ', jobapps);
      var userarr = [];
      // jobapps.forEach(jobapp => async function(){
      //   var user = await User.findById(jobapp.userid);
      //   console.log('Found user in managejob: ',user);
      //   userarr.push(user);
      //   console.log('pushed user in managejob: ',user);
      // });
      for (var i = 0; i < jobapps.length; i++) {
        var user = await User.findById(jobapps[i].userid);
        console.log('Found user in managejob: ', user);
        userarr.push(user);
        console.log('pushed user in managejob: ', user);
      }
      console.log('userarr: ', userarr);
      res.render('managejob', { jobapps: jobapps, userarr: userarr, companyid: req.body.companyid });
    }
  });
});

app.post('/reject_job', function (req, res) {
  JobApplication.updateOne({ _id: req.body.jobappid }, { status: 'Rejected' }, async function (err) {
    if (err) {
      console.log(err);
    } else {
      jobapps = await JobApplication.find({ companyid: req.body.companyid });
      console.log('Found jobapp in managejob: ', jobapps);
      var userarr = [];
      for (var i = 0; i < jobapps.length; i++) {
        var user = await User.findById(jobapps[i].userid);
        console.log('Found user in managejob: ', user);
        userarr.push(user);
        console.log('pushed user in managejob: ', user);
      }
      console.log('userarr: ', userarr);
      res.render('managejob', { jobapps: jobapps, userarr: userarr, companyid: req.body.companyid });
    }
  });
});



app.get('/profile_user/:id', function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      Job.find({}, function (err, jobs) {
        if (err) {
          console.log(err);
        } else {
          res.render("profile_user", { user: user, jobs: jobs });
        }
      });
    }
  });
});


app.get("/forgot_pass", function (req, res) {
  res.render("forgot_pass");
});

app.post('/submit_otp', function (req, res) {
  otp = req.body.otp;
  entered_otp = req.body.entered_otp;
  console.log('otp: ', otp);
  console.log('entered_otp: ', entered_otp);
  category = req.body.category;
  if (otp == entered_otp) {
    res.render('reset_pass', { category: category, email: req.body.email });
  } else {
    res.render('forgot_pass', { error: 'OTP does not match' });
  }
});

app.post('/reset_pass', function (req, res) {
  if (req.body.pass1 == req.body.pass2) {
    if (req.body.category == 'user') {
      User.updateOne({ email: req.body.email }, { password: md5(req.body.pass1) }, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.render('login', { error: 'Password reset successfully' });
        }
      });
    } else {
      Company.updateOne({ email: req.body.email }, { password: md5(req.body.pass1) }, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.render('login', { error: 'Password reset successfully' });
        }
      });
    }
  } else {
    res.render('reset_pass', { error: 'Passwords do not match', category: req.body.category, email: req.body.email });
  }
});

app.post('/generate_otp', function (req, res) {
  Company.findOne({ email: req.body.email }, function (err, company) {
    if (err) {
      console.log(err);
      User.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
          console.log(err);
        } else {
          var otp = Math.floor(100000 + Math.random() * 900000 - 1);
          console.log('OTP: ', otp);
          res.render('verify_otp', {category:'user', email: req.body.email, otp: otp, user: user });
        }
      });
    } else {
      var otp = Math.floor(100000 + Math.random() * 900000 - 1);
      console.log('OTP: ', otp);
      res.render('verify_otp', { category:'user', email: req.body.email, otp: otp });
    }
  });
});


app.get('/viewappliedjob/:id', function (req, res) {
  JobApplication.find({ userid: req.params.id }, function (err, jobapp) {
    if (err) {
      console.log(err);
    } else {
      res.render("viewappliedjob", { jobapp: jobapp });
    }
  });
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

app.get('/viewpostedjob/:id', function (req, res) {
  Job.find({ companyid: req.params.id }, function (err, job) {
    if (err) {
      console.log(err);
    } else {
      console.log('Found job in viewposted job: ', job);
      res.render('viewpostedjob', { job: job[0] });
    }
  });
});

app.post('/managejob', async function (req, res) {
  jobapps = await JobApplication.find({ companyid: req.body.companyid });
  console.log('Found jobapp in managejob: ', jobapps);
  var userarr = [];
  // jobapps.forEach(jobapp => async function(){
  //   var user = await User.findById(jobapp.userid);
  //   console.log('Found user in managejob: ',user);
  //   userarr.push(user);
  //   console.log('pushed user in managejob: ',user);
  // });
  for (var i = 0; i < jobapps.length; i++) {
    var user = await User.findById(jobapps[i].userid);
    console.log('Found user in managejob: ', user);
    userarr.push(user);
    console.log('pushed user in managejob: ', user);
  }
  console.log('userarr: ', userarr);
  res.render('managejob', { jobapps: jobapps, userarr: userarr, companyid: req.body.companyid });
})

// app.get('/managejob/:companyid', async function (req, res) {
//   // JobApplication.find({ companyid: req.params.companyid }, function (err, jobapps) {
//   //   if (err) {
//   //     console.log(err);
//   //   } else {
//   //     console.log('Found jobapp in managejob: ', jobapps);
//   //     var userarr = [];
//   //     jobapps.forEach(jobapp => {
//   //       User.findById(jobapp.userid, function (err, user) {
//   //         if (err) {
//   //           console.log(err);
//   //         } else {
//   //           console.log('Found user in managejob: ',user);
//   //           userarr.push(user[0]);
//   //         }
//   //       });
//   //     });
//   //     console.log('userarr: ',userarr);
//   //     res.render('managejob', { jobapps: jobapps, userarr: userarr });
//   //   }
//   // });
//   jobapps = await JobApplication.find({ companyid: req.params.companyid });
//   console.log('Found jobapp in managejob: ', jobapps);
//   var userarr = [];
//   // jobapps.forEach(jobapp => async function(){
//   //   var user = await User.findById(jobapp.userid);
//   //   console.log('Found user in managejob: ',user);
//   //   userarr.push(user);
//   //   console.log('pushed user in managejob: ',user);
//   // });
//   for (var i = 0; i < jobapps.length; i++) {
//     var user = await User.findById(jobapps[i].userid);
//     console.log('Found user in managejob: ', user);
//     userarr.push(user);
//     console.log('pushed user in managejob: ', user);
//   }
//   console.log('userarr: ', userarr);
//   res.render('managejob', { jobapps: jobapps, userarr: userarr });
// });
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
app.post("/profile", function (req, res) {
  console.log(req.body.companyid);
  Company.findById(req.body.companyid, function (err, company) {
    if (err) {
      console.log(err);
    } else {
      console.log(company);
      res.render("profile", { company: company });
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
          res.render("profile", { company: company });
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
        res.render("profile", { company: company[0] });
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
                  res.render("profile_user", { user: user[0], jobs: jobs });
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
const JobApplications = require("./model/JobApplications");
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to mongoose"));
