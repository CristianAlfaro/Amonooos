const mongoose  = require('mongoose');

// ESQUEMA PARA MENSAJES
var messageSchema = new mongoose.Schema({
	body: String,
	from: String,
	to:String,
	time: Number
});
module.exports = mongoose.model('Message',messageSchema);