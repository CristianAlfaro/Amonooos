const mongoose  = require('mongoose');

//ESQUEMA PARA NOTIFICACIONES

var notifSchema = new mongoose.Schema({
    body: String,
    from: String,
    to: String,
    status: String,
    time: Number,
    type: String
});

module.exports = mongoose.model('Notif', notifSchema);
