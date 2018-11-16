var mongoose= require('mongoose');

//class Schema
var ClassSchema = mongoose.Schema({
    code: {
        type: String
    },
    title:{
        type: String
    },
    description:{
        type: String
    },
    prerequisites:{

    },
    lessons:[{
        lesson_number:{type: Number},
        lesson_title:{type: String},
        lesson_body:{type: String}
    }]
})

//available outside
var Class= module.exports = mongoose.model('Class', ClassSchema);

//Fetch all classes
module.exports.getClasses= function(callback, limit){
    Class.find(callback).limit(limit);
}
//fetch a single class
module.exports.getClassById=function(id, callback){
    Class.findById(id, callback);
}

// add lesson

module.exports.addLesson=function(info,callback){
    class_id=info['class_id'];
    lesson_number=info['lesson_number'];
    lesson_title=info['lesson_title'];
    lesson_body=info['lesson_body'];

    Class.findByIdAndUpdate(
        class_id,
        { $push:
            {
                "lessons":{
                    lesson_number:lesson_number,
                    lesson_title:lesson_title,
                    lesson_body:lesson_body
                }
            }
        
        },
        {
            safe:true,
            upsert:true
        },
        callback
    );
}