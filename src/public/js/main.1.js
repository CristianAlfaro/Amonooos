window.onload = () => {
    app.init();
}

let app = {
    user: "",
    profilePhoto: "",
    init: function () {
        
        this.getusers(this.newPost);
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
            this.getfoto();
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
        }
        );
    },
    addEvents: function () {
       
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
        let friends = document.getElementsByClassName('followed')[0];
        if (data) {
            for (let index = 0; index < data.users.length; index++) {
                let tr = document.createElement("tr");
                tr.innerHTML = `<td>${data.users[index]._id} </td>
                        <td>${data.users[index].local.usuario}</td>
                        <td>"yujuuuu"</td>
                `
                friends.appendChild(tr);
            }
        }
        
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
        fetch('/profile/fotos', {
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
    getusers: function(newPost){
        fetch('/profile/user/users', {
            method: 'get'
        }).then(res => res.json()).then(data => {
            if(data.ok){    
                for (let index = 0; index < data.users.length; index++) {
                    console.log(data.users[index].local.usuario);
                }
                newPost(data, 1);

            }
        });
    }

};