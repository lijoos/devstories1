const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const config=require('../config/database');
//use schema
const UserSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
     password:{
        type:String,
        required:true
    },
    googleId:{
        type:String
    }
});
const User=module.exports=mongoose.model('User',UserSchema);
module.exports.getUserByID=function(id,callback){
    
User.findById(id,callback);
}
module.exports.getUserByUserName=function(username,callback){
     const query={ $or: [ {  username:username } ] }
   User.findOne( {  username:username },callback);
}
module.exports.getUserByUserEmail=function(email,callback){
     
    const query={email:email};
   // const query={ $or: [ {  username:username }, {  email:email } ] }
User.findOne(query,callback);
}

module.exports.getUserByUsers=function(callback){
   
User.find(callback);
}
module.exports.addUser = function(newUser, callback){
    
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
        console.log('.............................'+newUser+err); 
      if(err) throw err;
      newUser.password = hash;
      
      newUser.save(callback);
    });
  });
}
module.exports.comparePassword=function(candidatePassword,hash,callback){
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    });
}