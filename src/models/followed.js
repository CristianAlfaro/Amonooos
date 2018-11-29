let mongoose = require("mongoose");

//create the Schema
let followSchema = mongoose.Schema({
    usuario : String,
    follow : String,
    foto : String
});

module.exports= mongoose.model("Followed", followSchema);