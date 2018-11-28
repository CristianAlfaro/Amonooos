var multer = require('multer');
var upload = multer({ dest: '../uploads/' });
var path = require('path');
var fs = require('fs');
var Path = path.join(__dirname, "..", "public", "photos");
PostController = require('../config/postControllers');


var session = require('express-session');
var status = require('../models/status');
var notif = require('../models/notificaciones');
var User = require('../models/user');
var message = require('../models/mensajes');


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

    app.get('/followed', isLoggedIn, (req,res) => {
        res.render('followed', {
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

    app.post('/profile/upload', upload.array('foto', 1), PostController.create);

    // GET PHOTOS

    app.get('/profile/fotos/', PostController.mostrar);

    //DELETE PHOTO

    app.delete('/profile/delete/:id', PostController.delete);

    //GET USER

    app.get('/profile/user', PostController.usuario);

    //UPLOAD PROFILE PHOTO

    app.post('/profile/user/photo', upload.array('foto', 1), PostController.perfilfoto);

    //GET USER PROFILE PHOTO

    app.get('/profile/user/photo', PostController.getPhoto);

    //PUT USER PROFILE PHOTO

    app.put('/profile/user/photo', upload.array('foto', 1), PostController.updatePhoto);

    //upload background photo

    app.post('/profile/user/fondo', upload.array('foto', 1), PostController.fondofoto);

    //get user background photo

    app.get('/profile/user/fondo', PostController.getFondo);

    //put user background photo

    app.put('/profile/user/fondo', upload.array('foto', 1), PostController.updateFondo);

    //CHAT

    app.get('/chat', isLoggedIn, (req, res) => {
        res.render('chat', {
            user: req.user
        });
    });

    app.post('/chat', passport.authenticate('local-login', {
        successRedirect: '/chat',
        failureRedirect: '/',
        failureFlash: true
    }));

    //GET ALL USER 
    app.get('/profile/user/users', PostController.perfiles);
/*
    //nombre de usuario

    app.get('/profile/:username', function (req, res) {
        if (req.session.user) {
            var username = req.user.local.usuario.toLowerCase();
            var query = { username: username };
            var currentUser = req.session.user;

            if (username === currentUser) {
                status.find(query).sort({ time: -1 }).execFind(function (err, statuses) {
                    notif.find({}).sort({ time: -1 }).execFind(function (err, notifs) {
                        message.find({}).sort({ time: -1 }).execFind(function (err, messages) {
                            User.findOne({ username: currentUser.username }, function (err, user_) {
                                req.session.user = user_;
                                res.render('profile', {
                                    user: user_,
                                    statuses: statuses,
                                    notifs: notifs,
                                    messages: messages,
                                    currentUser: user_
                                });
                            });
                        });
                    });
                });
            } else {
                User.findOne(query, function (err, user) {
                    if (err || !user) { // Si no encuentro el perfil solicitado me redirecciona a el mio
                        res.redirect('/');
                    } else {
                        status.find(query).sort({ time: -1 }).execFind(function (err, statuses) {
                            notif.find({}).sort({ time: -1 }).execFind(function (err, notifs) {
                                message.find({}).sort({ time: -1 }).execFind(function (err, messages) {
                                    User.findOne({ username: currentUser.username }, function (err, user_) {
                                        req.session.user = user_;
                                        res.render('profile', {
                                            user: user,
                                            statuses: statuses,
                                            notifs:notifs,
                                            messages:messages,
                                            currentUser:user_

                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            }
        }else{
            res.redirect('/login/');
        }
    });

    //Enviar solicitud de amistad

    app.post('/send_request', function(req, res){
        console.log("Nueva solicitud de amistad!");
        if(req.session.user){
            var from = req.body.from;
            var to = req.body.to;
            var username = req.session.user.username; //ver si es este usuario

            //agreguemos a quien va la soli

            var query = {username:username};
            var wtn = req.session.user.waiting;
            wtn.push(to);

            var change = {waiting:wtn};

            User.update(query, change, function(err, user){
                //agregamos a quien se la eviamos
                User.findOne({username:to}, function(err, data){
                    var pnd = data.pending;
                    pnd.push(from);
                    change = {pending:pnd};

                    User.update({username:to}, change, function(err, user){

                        //si todo esta bien mandamos el mensaje

                        var notifiData = {
                            body: from + "Te ha enviado una solicitud de amistad", 
                            time: new Date().getTime(),
                            status: "not_read",
                            from: from,
                            to: to,
                            type: "req"
                        };
                        var newNotify = new notif(notifiData).save(function(err){
                            io.sockets.emit('notification ', {notifiData: notifiData});
                            res.redirect('/profile'+to);
                            
                        });
                    });
                    
                });
            });
        } else { 
            res.render('index');
        }
    });

    //responder a la solicitud de amistad

    app.post('/respond_request', function(res, req){
        var ans = req.body.ans;
        if(ans === "Accept")
            console.log("La solicitud ha sido aceptada");
        else
            console.log("La solicitud ha sido rechazada");
        if(req.session.user){
            var from = req.body.from;
            var to = req.body.to;
            var username = req.session.user.username;

            // primero hay que mover la solicitud de quien viene

            var pnd = req.session.user.pending;
            for(var i=0; i<pnd.length; i++)
                if(pnd[i] === from)
                    break;
            pnd.splice(i,1);
            
            var frn = req.session.user.friends;
            if(ans === "Accept")
                frn.push(from);
            var change = {pending: pnd, friends:frn};

            User.update({username:username}, change, function(err, user){
                //hay que remover hoy hacia quien va
                User.findOne({username:from}, function(err, data){
                    var wtn = data.waiting;
                    for( var i=0; i<wtn.length; i++)
                        if(wtn[i]===to)
                            break;
                    wtn.splice(i,1);
                    var frn1 = data.friends;
                    if(ans === "Accept")
                        frn1.push(to);
                    change = {waiting:wtn, friends: frn1};
                    User.update({username:from}, change, function(err, data_){
                        //eniviar notificacion de aceptada
                        if(ans === "Accept"){
                            var notifiData = {

                                body: to+" ha aceptado tu solicitud de amistad",
                                time: new Date().getTime,
                                status: "not_read",
                                from: from,
                                to: to,
                                type: "res"
                            };
                            var newNotify = new notif(notifiData).save(function(err) {
                                io.sockets.emit('notification', {notifiData:notifiData});
                                res.redirect('/profile/'+from);
                            });
                        } //notificacion que te mandaron alv
                        else{
                            var notifiData = {

                                body: to+" no ha querido aceptarte.",
                                time: new Date().getTime,
                                status: "not_read",
                                from: from,
                                to: to,
                                type: "res"
                            };
                            var newNotify = new notif(notifiData).save(function(err) {
                                io.sockets.emit('notification', {notifiData:notifiData});
                                res.redirect('/profile/'+username);
                            });

                        }
                    });
                        
                });
            });
                    
        } else {
            res.render('index');
        }
    });
    //revisar si el usuario ya es nuestro amigo

    app.post('/check_friend', function(req,res){
        var currentUser = req.session.user;
        var flag = false;
        for(var i=0; i<currentUser.friends.length; i++)
            if(currentUser.friends[i]=== req.body.check){
                flag = true;
                break;
            }
        if(flag)
            res.send({ans:"yes"});
        else res.send({ans: "no"});
    });

    //marcar leido

    app.post('/mark_read', function(req,res){
        var change = {status:"read"};
        notif.update({time:req.body.time}, change, function(err, data){
            res.send({msg:"OK"});
        });
    });
    //ver si el usuario existe
    app.post('/check_user', function(req, res){
        User.findOne({username:req.body.username}, function(err, data){
            if(err||(!data)){
                res.send({msg:"not_valid"});
            }
            else{
                res.send({msg:"valid"});
            }
        });
    });
    */
};