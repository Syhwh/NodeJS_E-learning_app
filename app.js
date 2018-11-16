var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var favicon=require('serve-favicon');
var bodyParser=require('body-parser');
var exphbs=require('express-handlebars');
var expressValidator=require('express-validator');
var flash=require('connect-flash');
var session=require('express-session');
var passport=require('passport');
var localStrategy=require('passport-local'),Strategy;
var mongo=require('mongodb');
var mongoose=require('mongoose');
//Conection data base
var config=require('../elearning/models/database');
var connection = mongoose.connect(config.database, { useNewUrlParser: true });

var async=require('async');

//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classesRouter = require('./routes/classes');
var studentsRouter = require('./routes/students');
var instructorsRouter= require('./routes/instructors');
///

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('public/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('../../public/stylesheets/bootstrap.min.css',express.static(path.join(__dirname, '../../public/stylesheets/bootstrap.min.css')));
app.use( express.static(path.join(__dirname, '../../node_modules/popper.js/dist/umd/')));
app.use(express.static(path.join(__dirname, 'public/javascripts/holder')));
app.use(express.static(path.join(__dirname, '../../public/javascripts/holder/')));


// Express Session

app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

//Passport

app.use(passport.initialize());
app.use(passport.session());


//Express Validator
app.use(expressValidator({
  errorFormatter: function(param,msg,value){
    var namespace=param.split('.'),
    root =namespace.shift(),
    formParam=root;
    
    while(namespace.length){
      formParam+='['+namespace.shift()+']';
    }
    return{
      param:formParam,
      msg:msg,
      value:value
    };
  }
}));

//conect-flash
app.use(flash());

// Userglobal
app.get('*', function(req,res, next){
  res.locals.user=req.user || null;  
    if(req.user){
      res.locals.role =req.user.role;
     }
  next();
});


//Global Vars
app.use(function(req,res,next){
  res.locals.success_msg =req.flash('success_msg');
  res.locals.error_msg= req.flash('error_msg');
  res.locals.error= req.flash('error');
  next();
});


// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/classes', classesRouter);
app.use('/students',studentsRouter);
app.use('/instructors',instructorsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
