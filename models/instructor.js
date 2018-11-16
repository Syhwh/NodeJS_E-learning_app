
var mongoose= require('mongoose');
var class_id_2=require('mongodb').ObjectID;

//Student Schema

var InstructorSchema= mongoose.Schema({
    first_name:{
        type: String
    },
    last_name:{
        type:String
    },
    username:{
        type:String
    },
    email:{
        type:String
    },
    classes:[{
        //class_id:{type:[mongoose.Schema.Types.Mixed]}, 
        class_id:{type:[mongoose.Schema.Types.ObjectId]},
        class_code:{type:String},
        class_title:{type:String}
    }]

});

var Instructor = module.exports = mongoose.model('Instructor', InstructorSchema);
// get instructor 
module.exports.getInstructorByUsername= function(username, callback){
    var query={username: username};
    Instructor.findOne(query,callback);     
}
//Register Instructor for Class
module.exports.register = function(info,callback){
    instructor_ID=info['instructor_ID'];
    instructor_username=info['instructor_username'];
    console.log('id de la clase', info['class_id']);
    console.log('id de la clase', typeof(info['class_id']));    
    console.log('id de la clase', info['class_id'].length);
    //class_id= mongoose.Types.ObjectId(info['class_id']);
    //console.log('id de la clase', class_id);
    class_id=info['class_id'];
    class_code=info['class_code'];
    class_title=info['class_title'];

    var query = {username: instructor_username};
    //var query={_id:instructor_ID};
    Instructor.findOneAndUpdate(
    // Instructor.findByIdAndUpdate(
        query,
        {
            $push: {
                "classes":{
                    class_id:class_id, 
                    class_code:class_code, 
                    class_title:class_title
                    }
            }
        },
       
       {   safe: true, 
           upsert: true
        },
        callback
        );

    }