const mongoose = require('mongoose'),
    postModel = require('../models/post'),
    perfilModel = require('../models/perfil'),
    fondoModel = require('../models/fondo'),
    followModel = require('../models/followed'),
    multer = require('multer'),
    path = require('path'),
    fs = require('fs');
var Path = path.join(__dirname,"..", "public", "photos");
var Path2 = path.join(__dirname,"..", "public", "ProfilePhotos");
const Image = require('../models/post');
const ImagePerfil = require('../models/perfil');
const ImageFondo = require('../models/fondo');
const User = require('../models/user');

const PostController = {};
User
PostController.create = function (req, res) {
    var x = 0;
    let data = {
        usuario: req.user.local.usuario,
        image: req.files[x].originalname,
        comentario: req.body.comentario[x]
    };
    console.log(req);   
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
    Image.find({'usuario': req.user.local.usuario},function(err,images){
        if(err){
            res.status(500);
            res.json({code:500, err});
        } else {
            res.json({ok: true, images});
        }
    });
};
PostController.perfiles = function (req, res){
    ImagePerfil.find({},function(err,users){
        if(err){
            res.status(500);
            res.json({code:500, err});
        } else {
            res.json({ok: true, users});
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
PostController.perfilfoto = function(req,res){
    var x = 0;
    let data = {
        usuario: req.user.local.usuario,
        image: req.files[x].originalname,
    };
    if (data.usuario && data.image && data.usuario != '' && data.image != '') {
        let nuevoPerfil = new perfilModel(data);
        nuevoPerfil.save(function (err, save) {
            if (err) {
                res.status(500);
                res.json({ code: 500, err });
            } else {
                fs.createReadStream('../uploads/' + req.files[x].filename).pipe(fs.createWriteStream(path.join(Path2, req.files[x].originalname)));
                fs.unlink('../uploads/' + req.files[x].filename);
                res.json({ ok: true, message: 'Se a guardado con exito', save });
            }
        });
    } else {
        res.status(400);
        res.json({err:{code: 400,  message: 'Faltan datos', data}});
    }
};
PostController.getPhoto = function(req, res){
    ImagePerfil.findOne({'usuario': req.user.local.usuario}, function(err, image){
        if(err){
            res.status(500);
            res.json({code: 500, err});
        } else { 
            res.json({ok: true, image});
        }
    })
};
PostController.updatePhoto = function(req, res){
    var x = 0;
    let update = {
        usuario: req.user.local.usuario,
        image: req.files[x].originalname,
    };

    ImagePerfil.findOneAndUpdate({'usuario': req.user.local.usuario}, update, function(err, old){
        if (err) {
            res.status(500);
            res.json({code:500, err});
        } else {
            fs.createReadStream('../uploads/' + req.files[x].filename).pipe(fs.createWriteStream(path.join(Path2, req.files[x].originalname)));
            fs.unlink('../uploads/' + req.files[x].filename);
            res.json({ok: true, old, update});
        }
    });

}
PostController.fondofoto = function (req, res) {
    var x = 0;
    let data = {
        usuario: req.user.local.usuario,
        image: req.files[x].originalname,
    };
    if (data.usuario && data.image && data.usuario != '' && data.image != '') {
        let nuevoFondo = new perfilModel(data);//
        nuevoFondo.save(function (err, save) {//
            if (err) {
                res.status(500);
                res.json({ code: 500, err });
            } else {
                fs.createReadStream('../uploads/' + req.files[x].filename).pipe(fs.createWriteStream(path.join(Path2, req.files[x].originalname)));
                fs.unlink('../uploads/' + req.files[x].filename);
                res.json({ ok: true, message: 'Se a guardado con exito', save });
            }
        });
    } else {
        res.status(400);
        res.json({err:{code: 400,  message: 'Faltan datos', data}});
    }
};
PostController.getFondo = function (req, res) {
    ImageFondo.findOne({'usuario': req.user.local.usuario}, function(err, image){
        if(err){
            res.status(500);
            res.json({code: 500, err});
        } else { 
            res.json({ok: true, image});
        }
    })
};
PostController.updateFondo = function (req, res) {
    var x = 0;
    let update = {
        usuario: req.user.local.usuario,
        image: req.files[x].originalname,
    };

    ImageFondo.findOneAndUpdate({'usuario': req.user.local.usuario}, update, function(err, old){
        if (err) {
            res.status(500);
            res.json({code:500, err});
        } else {
            fs.createReadStream('../uploads/' + req.files[x].filename).pipe(fs.createWriteStream(path.join(Path2, req.files[x].originalname)));
            fs.unlink('../uploads/' + req.files[x].filename);
            res.json({ok: true, old, update});
        }
    });


};
PostController.followed = function(req,res){
    let data = {
        usuario: req.user.local.usuario,
        follow: req.body.followed,
        foto: req.body.foto
    };
        let nuevoFollow = new followModel(data);
        nuevoFollow.save(function (err, save) {
            if (err) {
                res.status(500);
                res.json({ code: 500, err });
            } else {
                res.json({ ok: true, message: 'Se a guardado con exitoAhora son amigos', save });
            }
        });

};
PostController.getFollowed = function (req, res){
    followModel.find({usuario: req.user.local.usuario},function(err,users){
        if(err){
            res.status(500);
            res.json({code:500, err});
        } else {
            res.json({ok: true, users});
        }
    });
};


module.exports = PostController;	