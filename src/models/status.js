const mongoose  = require('mongoose');

//MODELO DEL ESTADO
var statusSchema = new mongoose.Schema({
    body: String,
    time: Number,
    usuario: String,
    comments: Array,
    likes: Array
});

module.exports = mongoose.model('Status', statusSchema);