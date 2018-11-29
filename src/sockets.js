const mongoose = require('mongoose');
const Chat = require('./models/chatbase');
const Post = require('./models/post');
const postController = {};

//console.log(user.local.usuario);

module.exports= function(io,passport){//exporta la funcion
io.on('connection',socket => {
    console.log('new user connect');//nuevo usuario por medio de socket\
    socket.on('send message',function(req,res){//r3ecibido de caja de texto
            

        //RECEPTOR///////////////////
            io.sockets.emit('nuevo mensaje',req.mensaje);//evento enviado por el servidor
           // console.log(req);    
            //console.log(session.user);
             let mensaje = {
                usuario : req.usuario,
                mensaje : req.mensaje
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
