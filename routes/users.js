const express=require('express');
const router=express.Router();
const passport=require('passport');
const jwt=require('jsonwebtoken');
let Strategy=require("passport-github");
const User=require('../model/user');
const Config=require('../config/database');



//gmail
passport.use(new Strategy({
    clientID:'75518d607e5137a3a91e' ,
    clientSecret:'d68933618e8445e32afca68f4f1713c33d3f9a3c',
    callbackURL:'http://localhost:3000/callback'},
    function(accessToken,refreshToken,profile,cb){
        cb(null,profile)()
    }
));

passport.serializeUser(function(user,cb){
    cb(null, user)
});
passport.deserializeUser(function(obj,cb){
    cb(null,obj)
});
router.use(require('express-session')({
         secret:'keyboard cat',
         resave:true,
         saveUninitialized:true
}));
router.use(passport.initialize())
router.use(passport.session())
router.get('/gmailSignUp',passport.authenticate('github'),function(req,res){
    console.log('hhhhhhhhhhhhhhhhhhhhh');
    res.send('sdsd')}

    )
    
//register
router.post('/register',(req,res,next)=>{
   console.log(req.body.email);
      //return res.json({success:false,msg :'user  Exist Already'});
    let newUser=new User({
        name:req.body.name,
        email:req.body.email,      
        password:req.body.password
    });
      User.getUserByUserEmail(req.body.email,(err,user)=>{
           
       if(err) throw err;
        console.log("email valida"+req.body.email)
        if(user){
        return res.json({success:false,msg :'Email already exist '});
        }
            User.addUser(newUser,(err,user)=>{
                
                if(err){
                    res.json({success:false,msg:'Fail to egiste user'});
                }
                else{
                    res.json({success:true,msg:'user Registered'});
                }

            })
        });
     });

//authenticate
router.post('/authenticate',(req,res,next)=>{
    
const email=req.body.email;
console.log(email)
    const password=req.body.password;
    User.getUserByUserEmail(email,(err,user)=>{
        if(err) throw err;
        if(!user){
        return res.json({success:false,msg :'user not found'});
        }
        User.comparePassword(password,user.password,(err,isMatch)=>{
            if(err) throw err;
            if(isMatch){
                const token=jwt.sign(user,Config.secret,{
                    expiresIn:604800
                });
                res.json({
                    success:true,
                    token:'JWT '+token,
                    user:{
                        id:user.id,
                        name:user.name,
                        email:user.email,
                        username:user.username
                    }
                });
            }
            else{
                return res.json({success:false,msg :'wrong password'});
            }
        })


    });
});

//register
router.get('/profile',passport.authenticate('jwt', {session:false}),(req,res,next)=>{
    console.log("response"+res)
  res.json({user: req.user});
});
//register
router.get('/user/:userId',function(req,res){
    console.log(req.params.userId);
    User.getUserByUserName(req.params.userId,(err,user)=>{
        if(err) throw err;     
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user)  return res.json({success:true,msg :'user not found'});
        if (user)  return res.json({success:false,msg :'user exist'});
        res.status(200).send(user);
    });
});


router.get('users', function (req, res) {
    User.findById(req.params.username, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (user!=null) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

//validate
router.get('/validate',(req,res)=>{

    user.getUserByUsers(function(err,users){

    res.send(users);

    })
    
});
//gmail signup
{
router.get(function(req,res){

})

}

router.get(function(req, res) {
        user.find(function(err, users) {
            if (err)
                res.send(err);

            res.send(users);
        });});

module.exports=router;