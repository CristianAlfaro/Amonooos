const mongoose = require('mongoose');
const Chat = require('./models/chatbase');
const User = require('./models/user');
const Post = require('./models/post');

const postController = {};



module.exports= function(io,passport){//exporta la funcion
io.on('connection',socket => {
    console.log('new user connect');//nuevo usuario por medio de socket\
    socket.on('send message',function(req,res){//r3ecibido de caja de texto
            

        //RECEPTOR///////////////////
            io.sockets.emit('nuevo mensaje',req);//evento enviado por el servidor
            console.log(req);    
             let mensaje = {
                usuario : req._id.usuario,
                mensaje : req
            }
           // console.log(User.find(User.local.usuario({})));
            console.log(mensaje);
            Chat.create(mensaje,function(err){
                if(err) return res.status(500).json({mensaje:'error'});
            })
    })
}
)

};
