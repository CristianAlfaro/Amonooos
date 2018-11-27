window.onload = () => {
    app.init();
}

let app = {
    user: "",
    init: function () {
        this.getusuario(() =>{
            this.addEvents();       
            this.loadContent(this.newPost);
        }     
        );
    },
    addEvents: function () {
        document.postForm.addEventListener("submit", (event) => {
            this.createPost(event, this.newPost);
        });
    },
    newPost: function(data){
        let post = document.getElementsByClassName('publicaciones')[0];
        let div = document.createElement("div");
        div.classList.add('post');
        div.innerHTML = `
            <h3> ${data.usuario} </h3>
            <img src= "/photos/${data.image}"> 
            <div class= "opciones">
                <a href="#" class="delete"> Delete </a> 
                <a href="#" class="update"> Update </a>
            </div>
        `;
        div.getElementsByClassName("delete")[0].addEventListener("click", (event) => {
            this.deletePost(event, data, div, post);
        });
        post.appendChild(div);
    },
    createPost: function(event,newPost)  {
        event.preventDefault();
        var formData  = new FormData(document.postForm);
        console.log(formData);
        let options = {
            method: 'POST',
            body: formData
        };       
        fetch('/amonooos/profile/upload', options).then(res => res.json())
        .then(_data => {
            if(_data.ok) {
                newPost(_data.save)
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
    }
    
};