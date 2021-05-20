const passport = require('passport');
const bcrypt = require('bcrypt');
let GoogleStrategy = require('passport-google-oauth20').Strategy;
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/AccountModel')
module.exports = function(){
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
            done(null, id);
    });
    passport.use(new GoogleStrategy({
            clientID: "240525245397-3trb5qnj9mtgtunjnnj48lefgt37j02s.apps.googleusercontent.com",
            clientSecret: "IB0wFdX7surB9gUyAOM2wrN1",
            callbackURL: "http://localhost:5000/auth/google/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(()=>{
                User.findOne({"google.id": profile.id}, (err, user)=> {
                    if(err) {
                        return done(err);
                    } else if(user) {
                        return done(null, user);
                    } else {
                        let newUser = new User({
                            local: {
                                password: "",
                                phone_number: "",
                                birthday: ""
                            },
                            google: {
                                id: profile.id,
                                token: accessToken,
                                class: ""
                            },
                            first_name: profile.name.givenName,
                            last_name: profile.name.familyName,
                            email: profile.emails[0].value,
                            departments: "",
                            role: "student"
                        });
                        newUser.save((err)=>{
                            if(err) {
                                console.log(err)
                                throw err;
                            }
                            return done(null, newUser)
                        })
                    }
                })
            })

        }
    ));

}




