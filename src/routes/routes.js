var multer = require('multer');
var upload = multer({ dest: '../uploads/' });
var path = require('path');
var fs = require('fs');
var Path = path.join(__dirname, "..", "public", "photos");

const Image = require('../models/post');

module.exports = (app, passport) => {

    app.get('/amonooos', (req, res) => {
        res.render('index');
    });


    app.post('/amonooos', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    //LOGIN

    app.get('/amonooos/login/', (req, res) => {
        res.render('login', {
            message: req.flash('loginMessage')
        });

    });

    app.post('/amonooos/login', passport.authenticate('local-login', {
        successRedirect: '/amonooos/profile',
        failureRedirect: '/amonooos/login',
        failureFlash: true
    }));


    //SIGN UP

    app.get('/amonooos/signup', (req, res) => {
        res.render('signup', {
            message: req.flash('signupMessage')
        });

    });

    app.post('/amonooos/signup', passport.authenticate('local-signup', {
        successRedirect: '/amonooos/profile',
        failureRedirect: '/amonooos/signup',
        failureFlash: true
    }));


    //PROFILE

    app.get('/amonooos/profile', isLoggedIn, (req, res) => {
        res.render('profile', {
            user: req.user
        });
    });


    //LOG OUT

    app.get('/amonooos/logout', (req, res) => {
        req.logout();
        res.redirect('/amonooos');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/amonooos');
    }

    //UPLOAD PHOTO

    app.post('/amonooos/profile/upload', upload.array('foto', 1), function (req, res, next) {
        console.log(req.user.local.usuario);
        for (var x = 0; x < req.files.length; x++) {
            //copiamos la referencia de la imagen en la base de datos
            var newImage = new Image();
            newImage.local.usuario = req.user.local.usuario;
            newImage.local.image = path.join(Path, req.files[x].originalname);
            newImage.save(function (err) {
                if (err) { throw err; }
            });
            //copiamos el archivo a la carpeta definitiva de fotos
            fs.createReadStream('../uploads/' + req.files[x].filename).pipe(fs.createWriteStream(path.join(Path, req.files[x].originalname)));
            //borramos el archivo temporal creado
            fs.unlink('../uploads/' + req.files[x].filename);
        }
        var pagina = '<!doctype html><html><head></head><body>' +
            '<p>Se subieron las fotos</p>' +
            '<br><a href="/amonooos/profile/">Retornar</a></body></html>';
        res.send(pagina);
    });


    // GET PHOTOS

    app.get('/amonooos/profile/fotos', function (req, res, next) {
        fs.readdir(Path, function (err, files) {
            var pagina = '<!doctype html><html><head></head><body>';
            for (var x = 0; x < files.length; x++) {
                pagina += '<img src="/photos/' + files[x] + '"><br>';
            }
            pagina += '<br><a href="/amonooos/profile">Retornar</a></body></html>';
            res.send(pagina);
        });
    });


};