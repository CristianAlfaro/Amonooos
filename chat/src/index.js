const   http =require('http'),//requiere el modulo http//modulo capas de hacer un server
        path=require('path'),//sirve para directorios (los une)
        express =require('express'),//requiere modulo express
        socketio=require('socket.io'),//modulo que conecta en tiempo real 
        app =express(),//es una manera de crear un servidor por express
        server =http.createServer(app),//le manda la app (lo que esta escrito abajo)
        io = socketio.listen(server);//devuelve conexion de isockets para enviar y recibir (cliente ,servidorr)


//funciones requeridas
app.set('port',process.env.PORT||8080);//obtener el puerto original o el 3000
require('./sockets')(io);//funcion externa que se llama


//++++++++++++++++++++++++++++++static files//nombres de archivos que no cambian//intefaz//
//(__dirname +'/public'==> directorio solo en linux
app.use(express.static(path.join(__dirname,'public')));//envia la carpeta public al servidor
//+++++++++++++++++++++++++++++++servidor escuchando //empezando
server.listen(8080,()=>{
    console.log('server on port 8080')//solo dice que se esta ejecutando alv
});