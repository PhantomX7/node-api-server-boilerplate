const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions={usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions,function(email,password,done){
  //verify email and password
  User.findOne({email:email},function(err,user){
    if(err){ return done(err); }
    if(!user){ return done(null,false);}

    user.comparePassword(password,function(err,isMatch){
      if(err) { return donse(err); }
      if(!isMatch){ return done(null,false);}
      return done(null,user);
    });
  });
});

//set up options for JWT Strategy
const jwtOptions={
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions,function(payload,done){
  //see if the user id in the payload exist in our database
  //if exist call 'done'
  // if none, call done without user Object
  User.findById(payload.sub,function(err,user){
    if(err){ return done(err, false); }
    if(user){
      done(null,user);
    }else {
      done(null,false);
    }
  });
});
//when user try to login

//tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin)
