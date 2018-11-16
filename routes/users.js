var express = require('express');
var router = express.Router();

var passport= require('passport');
var LocalStrategy = require('passport-local').Strategy;

//Include user model
var User = require('../models/user');
//include Student model
var Student= require('../models/student');
//include Instructor Model
var Instructor= require('../models/instructor')


/* User register GET */
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

//post request

router.post('/register', function(req, res, next) {
  // get values
  var first_name = req.body.first_name;
  var last_name =  req.body.last_name;
  var email =req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var role = req.body.role;
  var terms = req.body.termsAndConditions;
  

 
  // form validation
  req.checkBody('first_name','First Name field is required').notEmpty();
  req.checkBody('last_name','Last Name field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email must be a valid email adress').isEmail();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);
//req.checkBody('terms', 'You must agree with the terms and conditions').equals('on');

  // errors
  errors = req.validationErrors();

  if (errors){
    res.render('users/register',{
      errors:errors
      
    });
    
       

  } else{
    
    var newUser =new User({
      email: email,
      username: username,
      password: password,
      role: role
    });
    if (role=='student'){
      console.log('Registering student');
      var newStudent =new Student({
        first_name:first_name,
        last_name:last_name,
        email: email,
        username: username
      });
      User.saveStudent(newUser,newStudent,function(err,user){
        console.log('New Student Created');
      });
    }else{
      console.log('Registering instructor');
      var newInstructor =new Instructor({
        first_name:first_name,
        last_name:last_name,
        email: email,
        username: username
      });
      User.saveInstructor(newUser,newInstructor,function(err,user){
        console.log('New Instructor Created');
      });
    }
     req.flash('success_msg', 'User Added');
     res.redirect('/');
  }  
});
// serializer
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id,function(err, user){
    done(err,user);
  });
});

// After login form

router.post('/login', passport.authenticate('local',{failureRedirect:'/',failureFlash:true}), function(req, res, next){
  req.flash('success_msg','You are now logged in');
  var userRole = req.user.role;
  
  res.redirect('/'+userRole+'s/classes');
});



passport.use( new LocalStrategy(  
  function(username, password, done){    
    User.getUserByUsername(username, function(err,user){  
      if (err) throw err;
      if (!user){
        return done(null, false,{ message:'Unknown User'+ username});
      }
      User.comparePassword(password, user.password, function(err,isMatch){
        if (err) return done (err);
        if (isMatch){
          return done (null,user);
        }else{
          console.log('Invalid Password');
          return done(null,false,{message: 'Invalid Password'});
        }
      });
    });
  }
  ));


router.get('/logout', function(req,res){
  req.logout();
  //succes message
  req.flash('success',"You have logged out");
  res.redirect('/');
})

module.exports = router;
