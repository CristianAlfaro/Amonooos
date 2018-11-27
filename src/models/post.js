let mongoose = require("mongoose");

//create the Schema
let imageSchema = mongoose.Schema({
    usuario : String,
    image : {
        type : String,
        required: true
    },
    comentario : String
    

});

module.exports= mongoose.model("Image", imageSchema);