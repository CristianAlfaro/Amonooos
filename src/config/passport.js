const LocalStrategy  = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport){
    passport.serializeUser(function (user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done){
        User.findById(id, function(err, user){
            done(err,user);
        });
    });

    //sign up
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, usuario, password, done){
        User.findOne({'local.usuario': usuario}, function(err, user){
            if(err){return done(err);}
            if(user){
                return done(null, false, req.flash('signupMessage', 'The user is already taken'))
            } else {
                if (req.body.password2 == password){
                    User.findOne({'local.email': req.body.email}, function(err, user){
                        if(err){return done(err);}
                        if(user){
                            return done(null, false, req.flash('signupMessage', 'The email is already used with another account'))
                        } else {
                            var newUser = new User();
                            newUser.local.usuario = usuario;
                            newUser.local.password = newUser.generateHash(password);
                            newUser.local.email = req.body.email;
                            newUser.save(function(err){
                            if(err){throw err;}
                            return done(null, newUser);    
                            });
                        } 
                });
                } else {
                    return done(null, false, req.flash('signupMessage', 'Passwords do not match'))
                }
                
            }
        
        })
    }));

    //login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'usuario',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, usuario, password, done){
        User.findOne({'local.usuario': usuario}, function(err, user){
            if(err){return done(err);}
            if(!user){
                return done(null, false, req.flash('loginMessage', 'No User found'));
            } 
            if(!user.validatePassword(password)){
                return done( null, false, req.flash('loginMessage', 'Wrong password'));
            }
            return done(null, user);
        })
    }));
}