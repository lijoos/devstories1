const mongoose= require("mongoose");
const config=require("../config/database");
//questionaire schema
const QuestionaireSchema=mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    programmingLanguage:{
        type:String,
        required:true
    },
    questionDesc:{
        type:String,
        required:true
    },
     answer:{
        type:String,
        required:true
    },
    downVote:{
        type:String
    },
    downVote:{
        type:String
    },
    upVote:{
        type:String
    },
    rating:{
        type:String
    }
});
const Questionaire=module.exports=mongoose.model('Questionaire',QuestionaireSchema);
module.exports.addQuestion=function(newQuestion,callback){
    newQuestion.save(callback);
}

//get all questions
module.exports.getAllQuestionAns=function(questionaire,callback){
   // const query={email:email};
 //   console.log(email);
   // const query={ $or: [ {  username:username }, {  email:email } ] }
questionaire.find(callback);
}