var express = require('express');
var router = express.Router();

var Class=require('../models/class');
/* GET Class page. */
router.get('/', function(req, res, next) {
  Class.getClasses(function(err,classes){
      if (err) throw err;
    res.render('classes/index', { classes: classes });
  },3); 
});
// details classes
router.get('/:id/details', function(req, res, next) {
    Class.getClassById([req.params.id],function(err, classname){
        if (err) throw err;
        res.render('classes/details', { class: classname });
    });
});

// get lessons
router.get('/:id/lessons', function(req, res, next) {
    Class.getClassById([req.params.id],function(err, classname){
        if (err) throw err;
        res.render('classes/lessons', { class: classname });
    });
});

//get lesson

router.get('/:id/lessons/:lesson_id',function(req,res,next){
    Class.getClassById([req.params.id],function(err,classname){
        var lesson;
        if (err) throw err;
        for (i=0;i<classname.lessons.length;i++){
            if(classname.lessons[i].lesson_number==req.params.lesson_id){
                lesson=classname.lessons[i];
            }
        }
        res.render('classes/lesson',{class:classname, lesson:lesson});
    });
});

module.exports = router;
