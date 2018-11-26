let mongoose = require("mongoose");

//create the Schema
let imageSchema = mongoose.Schema({
    usuario : String,
    image : {
        type : String,
        required: true
    }
    

});

module.exports= mongoose.model("Image", imageSchema);