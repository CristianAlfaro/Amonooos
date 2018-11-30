var multer = require('multer');
var upload = multer({ dest: '../uploads/' });
var path = require('path');
var fs = require('fs');
var Path = path.join(__dirname, "..", "public", "photos");
PostController = require('../config/postControllers');

//var chat=require('../models/chatbase')

const Image = require('../models/post');

module.exports = (app, passport) => {


    app.get('/', (req, res) => {
        res.render('index');
    });

    //Agregando ruta de inicio
    app.get('/inicio', (req, res) => {
        res.render('inicio');
    });
    //

    app.post('/', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //LOGIN

    app.get('/login/', (req, res) => {
        res.render('login', {
            message: req.flash('loginMessage')
        });

    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //SIGN UP

    app.get('/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage')
        });

    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    //HOME

    app.get('/home', isLoggedIn, (req, res) => {
        res.render('home', {
            user: req.user
        });
    });

    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile', {
            user: req.user
        });
    })

    //FOLLOW

    app.get('/profile/user/followed', isLoggedIn, (req, res) =>{
        res.render('followed', {
            user: req.user
        });
    })

    app.get('/profile/user/alluser', isLoggedIn, (req,res) => {
        res.render('allUser', {
            user: req.user
        });
    })

    //LOG OUT

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    }

    //UPLOAD PHOTO

    app.post('/profile/upload', isLoggedIn, upload.array('foto', 1), PostController.create);

    // GET PHOTOS

    app.get('/profile/fotos/', isLoggedIn, PostController.mostrar);

    app.get('/profile/fotos/followed', isLoggedIn, PostController.mostrarfotos);

    //DELETE PHOTO

    app.delete('/profile/delete/:id', isLoggedIn, PostController.delete);

    //GET USER

    app.get('/profile/user', isLoggedIn, PostController.usuario);

    //UPLOAD PROFILE PHOTO

    app.post('/profile/user/photo', isLoggedIn, upload.array('foto', 1), PostController.perfilfoto);

    //GET USER PROFILE PHOTO

    app.get('/profile/user/photo', isLoggedIn, PostController.getPhoto);

    //PUT USER PROFILE PHOTO

    //console.log(this.fondoPhoto.image);
    app.put('/profile/user/photo', isLoggedIn, upload.array('foto', 1), PostController.updatePhoto);

    //CHAT
    app.get('/chat', isLoggedIn, (req, res) => {
        res.render('chat', {
            user: req.user
        });
    });

    app.post('/chat', isLoggedIn, passport.authenticate('local-login', {
        successRedirect: '/chat',
        failureRedirect: '/',
        failureFlash: true
    }));

    //GET ALL USER 
    app.get('/profile/user/allusers', isLoggedIn, PostController.perfiles);

    //ADD FOLLOWED
    app.post('/profile/user/follow', isLoggedIn, PostController.followed);

    app.delete('/profile/user/desfollowed', isLoggedIn, PostController.deletefollowed);

    //GET FOLLOWED
    app.get('/profile/user/search', isLoggedIn, PostController.getFollowed);

    app.get('/profile/user/users', isLoggedIn, PostController.perfiles);

    
};