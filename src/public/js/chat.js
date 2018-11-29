//chat
$(function(){
    //alert('works')
    const socket =io();
    //obteniedno elementos del DOM
    const $messageForm = $('#message-form');
    const $messageBox=$('#message');
    const $chat=$('#chat');
    const $user=$('#user');

    $messageForm.submit( e => {//enviar al sevidor
        e.preventDefault();
        //console.log('enviando datos');
        //console.log($messageBox.val());
        socket.emit('send message',$messageBox.val());
        $messageBox.val('');    
    });
    //recibir del servidor
    /////////////////////emisor////////////
    socket.on('nuevo mensaje',function(req,res){
       // console.log(req);
        let usuario=document.getElementById('#user');       
        let contenido =  document.querySelector("#chat");
        console.log("usuario es "+usuario);
     console.log(contenido);
     contenido.innerText="";
        $chat.append(req);
        $('<li class="replies"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + req +'<br>' +Date()+ '</br></p></li>').appendTo($('.messages ul'));
        //$('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' + req + '</p></li>').appendTo($('.messages ul'));

    });


})
