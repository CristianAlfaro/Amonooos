//chat
$(function(){
    //alert('works')
    const socket =io();
    //obteniedno elementos del DOM
    const $messageForm = $('#message-form');
    const $messageBox=$('#message');
    const $chat=$('#chat');
    //const $user=$('#user');
    let usuario=document.querySelector('#userActual'); 

    $messageForm.submit( e => {//enviar al sevidor
        e.preventDefault();
        //console.log('enviando datos');
        //console.log($messageBox.val());
        socket.emit('send message',{mensaje: $messageBox.val(), usuario:usuario.textContent});
        $messageBox.val('');    
    });
    //recibir del servidor
    /////////////////////emisor////////////
    socket.on('nuevo mensaje',function(req,res){
       // console.log(req);
                
        let contenido =  document.querySelector("#chat");
        console.log("usuario es "+ usuario.textContent);
    
     contenido.innerText="";
        $chat.append(req);
        if (req.substr(0, 3) === '/2 ') {
            req = req.substr(3);
            var index = req.indexOf(' ');
            $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + req +'</p></li>').appendTo($('.messages ul'));

        }
        else{
            $('<li class="replies"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + req +'</p></li>').appendTo($('.messages ul'));
            //$('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + req + '</p></li>').appendTo($('.messages ul'));
    
        }
       
    });


})
