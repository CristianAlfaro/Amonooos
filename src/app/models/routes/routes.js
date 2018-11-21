module.exports = (app, passport) => {

        app.get('/amonooos', (req, res) => {
            res.render('index');
        });


        app.post('/amonooos', passport.authenticate('local-login',{
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));

        //LOGIN

        app.get('/amonooos/login', (req, res) => {
            res.render('login',{
               message: req.flash('loginMessage') 
            });
            
        });

        app.post('/amonooos/login', passport.authenticate('local-login',{
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

        app.post('/amonooos/signup', passport.authenticate('local-signup',{
            successRedirect: '/amonooos/profile',
            failureRedirect: '/amonooos/signup',
            failureFlash: true
        }));


        //PROFILE

        app.get('/amonooos/profile', isLoggedIn, (req,res) =>{
            res.render('profile', {
                user: req.user
            });
        });


        //LOG OUT

        app.get('/amonooos/logout', (req, res) =>{
            req.logout();
            res.redirect('/amonooos');
        });

        function isLoggedIn(req, res, next){
            if(req.isAuthenticated()){
                return next();
            }
            return res.redirect('/amonooos');
        }
        
};