window.onload = () => {
    app.init();
}

let app = {
    user: "",
    profilePhoto: "",
    followedUsers: {},
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
        this.getusersfollow(() => {
            this.getusuario(() => {
                //console.log(this.followedUsers.users);
                this.getusers(this.newPost, this.user, this.followUser, this.followedUsers);
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
        });

    },
    addEvents: function () {
    },
    newPost: function (data, user, followUser, followUsers) {
        console.log("--------------------------------------");
        console.log(followUsers.users);
        var lista = [];
        for (let index = 0; index < followUsers.users.length; index++) {
            lista.push(followUsers.users[index].follow); 
        }
        let friends = document.getElementsByClassName('followed')[0];
        if (data) {
            for (let index = 0; index < data.users.length; index++) {
                if (!(data.users[index].usuario == user)) {
                    if (!(lista.includes(data.users[index].usuario))) {
                        let tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td class= "center"> <img class ="fotoperfilsmall" src= "/ProfilePhotos/${data.users[index].image}"> </td>
                            <td>${data.users[index].usuario}</td>
                            <td><a href="#" class="follow">follow</a></td>
                            `
                        friends.appendChild(tr);
                        tr.getElementsByClassName("follow")[0].addEventListener("click", (event) => {
                            followUser(event, data.users[index].usuario, data.users[index].image);
                            friends.removeChild(tr);
                        });
                    }
                }
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
                        newPost(element, foto, followUser, [hola, hola2]);
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
    getusers: function (newPost, user, followUser, followed) {
        fetch('/profile/user/allusers', {
            method: 'get'
        }).then(res => res.json()).then(data => {
            if (data.ok) {
                newPost(data, user, followUser, followed);
            }
        });
    },
    getusersfollow: function (cb) {
        fetch('/profile/user/search', {
            method: 'get'
        }).then(res => res.json()).then(data => {
            if (data.ok) {
                console.log(data);
                this.followedUsers = data;
                console.log(this.followedUsers);
                cb();
            }
        });
    },
    followUser: function (event, follow, photo) {
        event.preventDefault();
        let dataForm = {
            followed: follow,
            foto: photo
        };
        let options = {
            method: 'POST',
            body: JSON.stringify(dataForm),
            headers: {
                'Content-type': 'application/json'
            }
        };
        fetch('/profile/user/follow', options).then(res => res.json())
            .then(_data => {
                if (_data.ok) {
                    console.log("ahora son amigos");
                } else {
                    document.getElementsByClassName("errors")[0].innerText = "No se pudo guardar";
                }
            });
    }



};