let mongoose = require("mongoose");

//create the Schema
let fondoSchema = mongoose.Schema({
    usuario : String,
    image : {
        type : String,
        required: true
    }
});

module.exports= mongoose.model("Fondo", fondoSchema);