var express= require('express');
var router= express.Router();
 
Class=  require('../models/class');
Student= require('../models/student');
User =require('../models/user');

router.get('/classes',function(req,res, next){
    Student.getStudentByUsername(req.user.username, function(err,student){
        if(err) throw err;
       
        res.render('students/classes', { student: student });
    });
});
module.exports=router;