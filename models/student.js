var mongoose= require('mongoose');

//Student Schema

var StudentSchema= mongoose.Schema({
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
        class_id:{type:[mongoose.Schema.Types.ObjectId]},
        class_code:{type:String},
        class_title:{type:String}
    }]

});

var Student= module.exports = mongoose.model('Student', StudentSchema);

module.exports.getStudentByUsername= function(username,callback){
    var query={username: username};
   
    Student.findOne(query,callback);
}