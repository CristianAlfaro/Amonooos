window.onload = () => {
    app.init();
}

let app = {
    user: "",
    profilePhoto: "",
    init: function () {
        this.getfoto(()=>{
            document.getElementById('foto_perfil').src = "/ProfilePhotos/"+this.profilePhoto.image;
        })
        this.getusuario(() =>{
            this.getfoto();
            this.addEvents();       
            this.loadContent(this.newPost);
        }     
        );
    },
    addEvents: function () {
        document.postForm.addEventListener("submit", (event) => {
            this.createPost(event, this.newPost);
        });
        document.formProfile.addEventListener("submit", (event)=>{
            this.createPhoto(event);
        });
    },
    newPost: function(data){
        let post = document.getElementsByClassName('publicaciones')[0];
        let div = document.createElement("div");
        div.classList.add('post');
        if(data.comentario){
            div.innerHTML = `
            <h3> ${data.usuario} ha publicado 1 foto </h3>
            <p> ${data.comentario} </p>
            <img src= "/photos/${data.image}"> 
            <div class= "opciones">
                <a href="#" class="delete"> Delete </a> 
                <a href="#" class="update"> Update </a>
            </div>
        `;} else{
            div.innerHTML = `
            <h3> ${data.usuario} ha publicado 1 foto</h3>
            <img src= "/photos/${data.image}"> 
            <div class= "opciones">
                <a href="#" class="delete"> Delete </a> 
                <a href="#" class="update"> Update </a>
            </div>
        `;
        }
        
        div.getElementsByClassName("delete")[0].addEventListener("click", (event) => {
            this.deletePost(event, data, div, post);
        });
        post.appendChild(div);
    },
    createPost: function(event,newPost)  {
        event.preventDefault();
        var formData  = new FormData(document.postForm);
        formData.append("comentario" , document.postForm.comentario.value);
        for (var value of formData.values()) {
            console.log(value); 
         }
        let options = {
            method: 'POST',
            body: formData
        };       
        fetch('/amonooos/profile/upload', options).then(res => res.json())
        .then(_data => {
            if(_data.ok) {
                newPost(_data.save);
                location.reload(true);
            } else {
                document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
            }
        });
    },
    loadContent: function (newPost) {
        fetch('/amonooos/profile/fotos', {
                method: 'GET'
            }).then(res => {
                return res.json()
            })
            .then(data => {

                if (data.ok) {
                    data.images.reverse().forEach(element => {
                        newPost(element);
                    });
                }
            })
    },
    deletePost: (event, data, div, post) => {
        event.preventDefault();
        fetch('/amonooos/profile/delete/' + data._id, {
            method: 'DELETE'
        }).then(res => res.json())
        .then(res => {
            if (res.ok){
                post.removeChild(div);
            } else {
                document.getElementsByClassName("errors")[0].innerText = "No se pudo elminiar";
            }
        })
    },
    getusuario: function(cb) {
        fetch('/amonooos/profile/user', {
            method: 'get'
        }).then (res => res.json()).then(data =>{
            if(data.ok){
                this.user = data.usuario;
                cb();
            }
        });
    },
    getfoto: function(cb){
        fetch('/amonooos/profile/user/photo', {
            method: 'get'
        }).then (res => res.json()).then(data => {
            if(data.ok){
                this.profilePhoto = data.image;
                cb();
            }
        });
    },
    createPhoto: function(event)  {
        event.preventDefault();
        var formData2  = new FormData(document.formProfile);
        for (var value of formData2.values()) {
            console.log(value); 
        }
        let options = {
            method: 'POST',
            body: formData2
        };       
        fetch('/amonooos/profile/user/photo', options).then(res => res.json())
        .then(_data => {
            if(_data.ok) {
                console.log("se subio con exito la foto");
                location.reload(true);
            } else {
                document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
            }
        });
    }
    
};