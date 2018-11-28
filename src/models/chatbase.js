let mongoose = require("mongoose");
 
let ChatSchema = mongoose.Schema({
    usuario:String,
    mensaje:String

})
module.exports= mongoose.model("Chat", ChatSchema);