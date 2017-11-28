const TwitterStrategy = require('passport-twitter').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User=require('../model/user');
const jwt=require('jsonwebtoken');
const Config=require('../config/database');
const passport=require('passport');
const express=require('express');
const router=express.Router();
let token="";
passport.serializeUser(function(user,done){
    token=jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
    done(null, user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        done(err,user);
    });
});
router.use(require('express-session')({
         secret:'keyboard cat',
         resave:true,
         saveUninitialized:true
}));
router.use(passport.initialize())
router.use(passport.session())

//twitter

passport.use(new TwitterStrategy({
    consumerKey: "HD6fx56SzVLTOGyKL8qLrHfFA",
    consumerSecret: "cRW4aCIWhxelGMHj3m15FtYUxY8kIOIXngyrAcKmihJqy0ASyN",
    callbackURL: "http://localhost:3000/passport/twitter/callback",
    userProfileURL:"https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
  },
  function(token, tokenSecret, profile, done) {
    done(null,profile);
  }
));
//google
passport.use(new GoogleStrategy({
   clientID: "897330727722-0pfl1usqjlrei3mif709o8jqlod8e0ch.apps.googleusercontent.com",
    clientSecret: "33A8q4qh1qI67ZBppVlEV4ky",
    callbackURL: "http://localhost:3000/passport/auth/google/callback"
  } 
  ,function(accessToken, refreshToken, profile, done) {
      User.findOne({email:profile.emails[0].value}).select('password email').exec(function (err,user){
      if(err) done (err);
      if(user && user!=null)
      {
        token=jwt.sign(user,Config.secret,{
                    expiresIn:604800
                }); 
         token='JWT '+token
        console.log('call back'+token)
    done(null,user);
      }
      else
      {
         done(err); 
      }
     })
  }
));

//twitter
router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',passport.authenticate('twitter', { failureRedirect: '/twitterror' }),function(req,res){
     console.log('call back')
    res.redirect('/register');
});

//google

router.get('/auth/google',
  passport.authenticate('google', { scope:  [ " https://www.googleapis.com/auth/plus.me ", " https://www.googleapis.com/auth/userinfo.email"] }));

router.get('/auth/google/callback',  passport.authenticate('google', { failureRedirect: '/login/:Error' }),function(req, res) {
      console.log('call back'+token)
      res.setHeader('Token', token);
    res.redirect('/home/'+token);
  });

 module.exports=router;