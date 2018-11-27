const mongoose = require('mongoose'),
    postModel = require('../models/post'),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs');
var Path = path.join(__dirname,"..", "public", "photos");
const Image = require('../models/post');

const PostController = {};

PostController.create = function (req, res) {
    var x = 0;
    console.log(req.files);
    let data = {
        usuario: req.user.local.usuario,
        image: req.files[x].originalname
    };
    if (data.usuario && data.image && data.usuario != '' && data.image != '') {
        let nuevoPost = new postModel(data);
        nuevoPost.save(function (err, save) {
            if (err) {
                res.status(500);
                res.json({ code: 500, err });
            } else {
                fs.createReadStream('../uploads/' + req.files[x].filename).pipe(fs.createWriteStream(path.join(Path, req.files[x].originalname)));
                fs.unlink('../uploads/' + req.files[x].filename);
                res.json({ ok: true, message: 'Se a guardado con exito', save });
            }
        });
    } else {
        res.status(400);
        res.json({err:{code: 400,  message: 'Faltan datos', data}});
    }
};
PostController.mostrar = function (req,res){
    //var contenido = document.getElementsByClassName('publicaciones');
    //console.log(contenido);
    Image.find({'usuario': req.user.local.usuario},function(err,images){
        if(err){
            res.status(500);
            res.json({code:500, err});
        } else {
            res.json({ok: true, images});
        }
    });
};
PostController.delete = function(req,res){
    postModel.findByIdAndRemove(req.params.id, function(err, eliminado){
        if (err) {
            res.status(500);
            res.json({code:500, err});
        } else {
            res.json({ok: true, eliminado});
        }
    });
};
PostController.usuario = function(req,res){
    
    var usuario = req.user.local.usuario;
    res.json({ok:true, usuario})
};
module.exports = PostController;	