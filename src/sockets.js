module.exports= function(io){//exporta la funcion
io.on('connection',socket => 
{
    console.log('new user connect');//nuevo usuario por medio de socket\
    socket.on('send message',function(data){//r3ecibido de caja de texto
        //console.log(data);
        io.sockets.emit('nuevo',data);//evento enviado por el servidor
    })


}
)

};