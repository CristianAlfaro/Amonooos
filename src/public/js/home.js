window.onload = () => {
    app.init();
}

let app = {
    user: "",
    profilePhoto: "",
    fondoPhoto: "",
    init: function () {

        this.getfoto(() => {
            document.getElementById('foto_perfil').src = "/ProfilePhotos/" + this.profilePhoto.image;
            var fotos = document.getElementsByClassName('foto');
            for (let index = 0; index < fotos.length; index++) {
                fotos[index].src = "/ProfilePhotos/" + this.profilePhoto.image;
            }
            
            
        });
        this.getusuario(() => {
            this.getfoto(()=>{
                this.loadContent(this.newPost, this.profilePhoto);
                this.getfoto(() => {
                console.log(this.profilePhoto.image);
                document.getElementById('foto_perfil').src = "/ProfilePhotos/" + this.profilePhoto.image;
                var fotos = document.getElementsByClassName('foto');
                for (let index = 0; index < fotos.length; index++) {
                    fotos[index].src = "/ProfilePhotos/" + this.profilePhoto.image;
                }
            });
            this.addEvents();
            });
            
        }
        );
    },
    addEvents: function () {
        document.postForm.addEventListener("submit", (event) => {
            this.createPost(event, this.newPost, this.profilePhoto);
        });
        if (this.profilePhoto) {
            console.log("puedes cambiar foto");
            document.formProfile.addEventListener("submit", (event) => {
                this.updatePhoto(event);
            });
        } else {
            document.formProfile.addEventListener("submit", (event) => {
                this.createPhoto(event);
            });
        }

    },
    newPost: function (data, foto) {
        let post = document.getElementsByClassName('publicaciones')[0];
        let div = document.createElement("div");

        let deletePost = this.deletePost;
        div.classList.add('post');
        if (foto.usuario == data.usuario) {
            if (data.comentario) {
                div.innerHTML = `
                    <div class="encabezado">
                    <img class = "foto fotoperfilsmall" src= "/img/user.png"> 
                    <h3> ${data.usuario} has published! </h3>
                    </div>
                    <p> ${data.comentario} </p>
                    <img src= "/photos/${data.image}"> 
                    <div class= "opciones">
                        <a href="/profile/delete/${data._id}" class="delete" post-id="${data._id}"><span class="fas fa-minus-circle"></span></a>
                        <a href="#" class="like"> <span class="fas fa-heart like"></span> </a> 
                        <a href="#" class="dislike"> <span class="fas fa-heartbeat dislike"></span> </a>
                    </div>
                `;
            } else {
                div.innerHTML = `
                    <h3> ${data.usuario} has published a photo!</h3>
                    <img src= "/photos/${data.image}"> 
                    <div class= "opciones">
                        <a href="/profile/delete/${data._id}" class="delete" post-id="${data._id}"><span class="fas fa-minus-circle"></span></a>
                        <a href="#" class="like"> <span class="fas fa-heart like"></span> </a> 
                        <a href="#" class="dislike"> <span class="fas fa-heartbeat dislike"></span> </a>
                    </div>
                `;
            }
        } else {
            if (data.comentario) {
                div.innerHTML = `
                    <div class="encabezado">
                    <img class = "foto fotoperfilsmall" src= "/img/user.png"> 
                    <h3> ${data.usuario} has published! </h3>
                    </div>
                    <p> ${data.comentario} </p>
                    <img src= "/photos/${data.image}"> 
                    <div class= "opciones">
                        <a href="#" class="like"> <span class="fas fa-heart like"></span> </a> 
                        <a href="#" class="dislike"> <span class="fas fa-heartbeat dislike"></span> </a>
                    </div>
                `;
            } else {
                div.innerHTML = `
                    <h3> ${data.usuario} has published a photo!</h3>
                    <img src= "/photos/${data.image}"> 
                    <div class= "opciones">
                        <a href="#" class="like"> <span class="fas fa-heart like"></span> </a> 
                        <a href="#" class="dislike"> <span class="fas fa-heartbeat dislike"></span> </a>
                    </div>
                `;
            }
        }


        post.appendChild(div);

        let deletes_post = document.querySelectorAll(".delete");
        deletes_post.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                fetch(this["href"], {
                    method: "DELETE"
                }).then(res => res.json())
                    .catch(err => console.error(err))
                    .then(response => {
                        alert("Eliminado con exito")
                    });
            })
        });

    },
    createPost: function (event, newPost, foto) {
        event.preventDefault();
        var formData = new FormData(document.postForm);
        formData.append("comentario", document.postForm.comentario.value);
        for (var value of formData.values()) {
            console.log(value);
        }
        let options = {
            method: 'POST',
            body: formData
        };
        fetch('/profile/upload', options).then(res => res.json())
            .then(_data => {
                if (_data.ok) {
                    newPost(_data.save, foto);
                    location.reload(true);
                } else {
                    document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
                }
            });
    },
    loadContent: function (newPost, foto) {
        fetch('/profile/fotos/followed', {
            method: 'GET'
        }).then(res => {
            return res.json()
        })
            .then(data => {

                if (data.ok) {
                    data.images.reverse().forEach(element => {
                        newPost(element, foto);
                    });
                }
            })
    },
    deletePost: (event, data, div, post) => {
        event.preventDefault();
        fetch('/profile/delete/' + data._id, {
            method: 'DELETE'
        }).then(res => res.json())
            .then(res => {
                if (res.ok) {
                    post.removeChild(div);
                    location.reload(true);
                } else {
                    document.getElementsByClassName("errors")[0].innerText = "No se pudo elminiar";
                }
            })
    },
    getusuario: function (cb) {
        fetch('/profile/user', {
            method: 'get'
        }).then(res => res.json()).then(data => {
            if (data.ok) {
                this.user = data.usuario;
                cb();
            }
        });
    },
    getfoto: function (cb) {
        fetch('/profile/user/photo', {
            method: 'get'
        }).then(res => res.json()).then(data => {
            if (data.ok) {
                this.profilePhoto = data.image;

                cb();
            }
        });
    },
    createPhoto: function (event) {
        event.preventDefault();
        var formData2 = new FormData(document.formProfile);
        for (var value of formData2.values()) {
            console.log(value);
        }
        let options = {
            method: 'POST',
            body: formData2
        };
        fetch('/profile/user/photo', options).then(res => res.json())
            .then(_data => {
                if (_data.ok) {
                    console.log("se subio con exito la foto");
                    location.reload(true);
                } else {
                    document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
                }
            });
    },
    updatePhoto: function (event) {
        event.preventDefault();
        var formData2 = new FormData(document.formProfile);
        for (var value of formData2.values()) {
            console.log(value);
        }
        let options = {
            method: 'PUT',
            body: formData2
        };
        fetch('/profile/user/photo', options).then(res => res.json())
            .then(_data => {
                if (_data.ok) {
                    console.log(_data);
                    location.reload(true);
                } else {
                    document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
                }
            });

    },
}