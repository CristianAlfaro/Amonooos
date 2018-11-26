window.onload = () => {
    app.init();
}

let app = {
    init: function () {
        this.addEvents();
        this.loadContent(this.newPost);
    },
    addEvents: function () {
        document.postForm.addEventListener("submit", (event) => {
            this.submitPost(event, this.newPost);
        });
    },
    newPost: function(data){
        let post = document.getElementsByClassName('publicaciones')[0];
        let div = document.createElement("div");
        div.classList.add('post');
        div.innerHTML = `
            <img src= "/photos/${data.image}"> 
            <a href="#" class="delete"> Delete </a> 
            <a href="#" class="update"> Update </a>
        `;
        div.getElementsByClassName("delete")[0].addEventListener("click", (event) => {
            this.deletePost(event, data, div, post);
        });
        post.appendChild(div);
    },
    createPost: (event,newPost) => {
        event.preventDefault();
        let data = {
            usuario: user.local.usuario,
            image: document.postForm.foto.value
        };
        fetch('/amonooos/profile/upload', {
            method: POST,
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(_data => {
            if(data.ok) {
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
                    data.images.forEach(element => {
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
    }
    
};