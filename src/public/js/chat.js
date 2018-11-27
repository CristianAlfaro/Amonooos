//chat
$(function(){
    //alert('works')
    const socket =io();
    //obteniedno elementos del DOM
    const $messageForm = $('#message-form');
    const $messageBox=$('#message');
    const $chat=$('#chat');

    $messageForm.submit( e => {//enviar al sevidor
        e.preventDefault();
        //console.log('enviando datos');
        //console.log($messageBox.val());
        socket.emit('send message',$messageBox.val());
        $messageBox.val('');    
    });
    //recibir del servidor
    socket.on('nuevo',function(data){
        console.log(data);
        $chat.append(data +'<br/>');
    });


})