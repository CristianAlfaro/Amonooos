window.onload = () => {
    app.init();
}

let app = {
    user: "",
    profilePhoto: "",
    init: function () {

        this.getfoto(() => {
            console.log(this.profilePhoto.image);
            document.getElementById('foto_perfil').src = "/ProfilePhotos/" + this.profilePhoto.image;
            var fotos = document.getElementsByClassName('foto');
            for (let index = 0; index < fotos.length; index++) {
                fotos[index].src = "/ProfilePhotos/" + this.profilePhoto.image;
            }
            /* var imagen = document.getElementsByClassName("fondo")[0];
             var url = "/ProfilePhotos/" + this.profilePhoto.image;
             imagen.style.backgroundImage = 'url('+url+')'; */
        });
        this.getusuario(() => {
            this.getusers(this.newPost, this.user, this.followUser);
            this.getfoto();
            this.loadContent(this.newPost, this.profilePhoto, this.followUser);
            this.getfoto(() => {
                console.log(this.profilePhoto.image);
                document.getElementById('foto_perfil').src = "/ProfilePhotos/" + this.profilePhoto.image;
                var fotos = document.getElementsByClassName('foto');
                for (let index = 0; index < fotos.length; index++) {
                    fotos[index].src = "/ProfilePhotos/" + this.profilePhoto.image;
                }
            });
            this.addEvents();
        }
        );
    },
    addEvents: function () {


    },
    newPost: function (data, user, followUser) {
        console.log(data);
        let friends = document.getElementsByClassName('followed')[0];
        if (data) {
            for (let index = 0; index < data.users.length; index++) {
                if(!(data.users[index].follow == user)){
                let tr = document.createElement("tr");
                tr.innerHTML = `
                <td class= "center"> <img class ="fotoperfilsmall" src= "/ProfilePhotos/${data.users[index].foto}"> </td>
                <td>${data.users[index].follow}</td>
                <td><a href="#" class="follow">desfollow</a></td>
                `
                friends.appendChild(tr);
                tr.getElementsByClassName("follow")[0].addEventListener("click", (event) => {
                    followUser(event, data.users[index].follow);
                    friends.removeChild(tr);
                });
                }
            } 

        }

    },
    createPost: function (event, newPost, foto, followUser) {
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
                    newPost(_data.save, foto, followUser);
                    location.reload(true);
                } else {
                    document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
                }
            });
    },
    loadContent: function (newPost, foto, followUser) {
        fetch('/profile/fotos', {
            method: 'GET'
        }).then(res => {
            return res.json()
        })
            .then(data => {

                if (data.ok) {
                    data.images.reverse().forEach(element => {
                        newPost(element, foto, followUser);
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
    getusers: function (newPost, user, followUser) {
        fetch('/profile/user/search', {
            method: 'get'
        }).then(res => res.json()).then(data => {
            if (data.ok) {
                for (let index = 0; index < data.users.length; index++) {
                    console.log(data.users[index].usuario);
                }
                console.log(data.users)
                newPost(data, user, followUser);

            }
        });
    }, 
    followUser: function (event, follow){
        event.preventDefault();
        let dataForm = {
            followed: follow
        };
        let options = {
            method: 'delete',
            body: JSON.stringify(dataForm),
            headers:{
                'Content-type': 'application/json'
            }
        };
        fetch('/profile/user/desfollowed',options).then(res => res.json())
        .then(_data => {
            if (_data.ok) {
                console.log("ahora ya no son amigos");
            } else {
                document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
            }
        });
    }



};