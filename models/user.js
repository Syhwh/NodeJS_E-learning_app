var mongoose=require('mongoose');
var bcrypt =require('bcrypt');
var async= require('async');

//User schema
var UserSchema = mongoose.Schema({
    username:{
        type: String
    },
    email:{
        type:String
    },
    password:{
        type:String,
        bcrypt:true
    },
    role:{
        type:String
    }
});

var User = module.exports= mongoose.model('User', UserSchema);

// Get users
module.exports.getUserById=function(id, callback){
    User.findById(id, callback);
}
module.exports.getUserByUsername= function(username,callback){
    var query={username: username};
    User.findOne(query, callback);
}
// compare password
module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if (err) throw err;
        callback(null, isMatch);
    })
}

//create users
//Create Student User
module.exports.saveStudent=function(newUser,newStudent,callback){
    bcrypt.hash(newUser.password,10,function(err,hash){
        if (err) throw errl
        //set hash
        newUser.password=hash;
        console.log('Student is being saved');
        async.parallel([newUser.save.bind(newUser), newStudent.save.bind(newStudent)],callback);
    });
}
//Create Instructor user
module.exports.saveInstructor=function(newUser,newInstructor,callback){
    bcrypt.hash(newUser.password,10,function(err,hash){
        if (err) throw errl
        //set hash
        newUser.password=hash;
        console.log('Instructor is being saved');
        async.parallel([newUser.save.bind(newUser), newInstructor.save.bind(newInstructor)], callback);
    });
}

