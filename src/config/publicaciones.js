const mongoose = require('mongoose');
const Post = require('../models/post');

const postController = {};

postController.upload = function (req, res, next) {
    for (var x = 0; x < req.files.length; x++) {
        //copiamos la referencia de la imagen en la base de datos
        var newImage = new Image();
        newImage.local.usuario = req.user.local.usuario;
        newImage.local.image = path.join(req.files[x].originalname);
        newImage.save(function (err) {
            if (err) { throw err; }
        });
        //copiamos el archivo a la carpeta definitiva de fotos
        fs.createReadStream('../uploads/' + req.files[x].filename).pipe(fs.createWriteStream(path.join(Path, req.files[x].originalname)));
        //borramos el archivo temporal creado
        fs.unlink('../uploads/' + req.files[x].filename);
    }
    var pagina = '<!doctype html><html><head></head><body>' +
        '<p>Se subieron las fotos</p>' +
        '<br><a href="/profile/">Retornar</a></body></html>';
    res.send(pagina);
}