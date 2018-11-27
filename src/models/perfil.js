let mongoose = require("mongoose");

//create the Schema
let perfilSchema = mongoose.Schema({
    usuario : String,
    image : {
        type : String,
        required: true
    }
});

module.exports= mongoose.model("ImagePerfil", perfilSchema);