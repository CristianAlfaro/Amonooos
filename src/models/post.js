let mongoose = require("mongoose");

//create the Schema
let imageSchema = mongoose.Schema({
    local: {
        usuario : String,
        image : {
            type : String,
            required: true
        }
    }
    

});

module.exports= mongoose.model("Image", imageSchema);