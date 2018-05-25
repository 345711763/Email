const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("../config/keys.js");
const mongoose = require("mongoose");
const User = mongoose.model("users");
passport.serializeUser((user,done)=>{
   done(null,user.id);
});
passport.deserializeUser((id,done)=>{
   User.findById(id).then((user)=>{
       done(null,user);
   });
});
passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "/auth/google/callback",
    proxy: true
},(accessToken,refreshToken,profile,done)=>{
    User.findOne({
        googleId:profile.id
    }).then((existingUser)=>{
       if(existingUser){
           //user have been registed before , we do nothing here
           done(null,existingUser);
       }else{
           //new user , we create a new record
           new User({googleId:profile.id})
               .save()
               .then(user=>{
                   done(null,user);
               });// create a Model instance and save to MongoDB
       }
    });

}));