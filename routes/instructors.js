var express=require('express');
var router=express.Router();

Class= require('../models/class');
Instructor=require('../models/instructor');
User=require('../models/user');

// show classes login
router.get('/classes', function(req,res, next){
    Instructor.getInstructorByUsername(req.user.username, function(err, instructor){       
    if(err) throw err;    
    res.render ( 'instructors/classes', {instructor: instructor});
    });
});

// register classes
router.post('/classes/register', function(req, res){
    info=[];
    info['instructor_ID']=req.user.id;
    info['instructor_username']=req.user.username;    
    info['class_id']=req.body.class_id.trim();
    console.log('tipo de dato del ID', typeof(req.body.class_id));
    console.log('Longitud del ID antes de pasar', info['class_id'].length);
    
    info['class_code']=req.body.class_code;
    info['class_title']=req.body.class_title;

    Instructor.register(info, function(err,instructor){
        console.log('entra a la funcion');
        if(err) throw err;
        console.log(instructor);
    });
    req.flash('success_msg','You are now registered to teach this class');
    res.redirect('/instructors/classes');
});
///Lessons part

router.get('/classes/:id/lessons/new', function(req,res, next){
    res.render ( 'instructors/newlesson', {class_id: req.params.id});
});


router.post('/classes/:id/lessons/new', function(req,res, next){
    var info=[];
    info['class_id']=req.params.id;
    info['lesson_number']=req.body.lesson_number; 
    info['lesson_title']=req.body.lesson_title;
    info['lesson_body']=req.body.lesson_body;

    Class.addLesson(info, function(err, lesson){
        console.log('lesson added..');
    });

    req.flash('success_msg','Lesson added');
    res.redirect('/instructors/classes');
    
});

///
module.exports=router;