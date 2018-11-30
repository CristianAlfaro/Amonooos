const express = require('express');
const app = express();


const path = require('path');
const server = require('http').Server(app);
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const io =  require('socket.io')(server);
const socket = require('./sockets')(io);


require('./config/passport')(passport);


const { url } = require('./config/database');

mongoose.connect(url, {
    useMongoClient: true
});

app.set('port', process.env.PORT || 8010);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'onilink1999',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req,res,next)=>{
    app.locals.signupMessage=req.flash('signupMessage');
    app.locals.signinMessage=req.flash('signupMessage');
    app.locals.user=req.user;
    next();
})
require('./routes/routes')(app, passport);


app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), () => {
    console.log('RED SOCIAL corriendo en http://localhost:8010/')
});