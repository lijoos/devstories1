const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');

const Questionaire=require('../model/questionaire');
const Config=require('../config/database');


router.post('/addquestion',(req,res,next)=>{
    let newQuestion=new Questionaire({
        answer:req.body.answer,
        category:req.body.category,
        programmingLanguage:req.body.programmingLanguage,
        questionDesc:req.body.questionDesc,
        downVote:req.body.downVote,
        upVote:req.body.upVote,
        rating:req.body.rating
    });
    Questionaire.addQuestion(newQuestion,(err,Questionaire)=>{
         console.log("kei");
        if(err){
                    res.json({success:false,msg:'Fail to Add Question'});
                }
                else{
                    res.json({success:true,msg:'Added Successfully'});
                }
    });

});

//getAllQuestionAns
router.get('/allQuestions',function(req,res){   
    Questionaire.getAllQuestionAns((err,questionaire)=>{
        if(err) throw err;     
        if (err) return res.status(500).send("There was a problem finding the data");
        res.status(200).send(questionaire);
    });
});

module.exports=router;