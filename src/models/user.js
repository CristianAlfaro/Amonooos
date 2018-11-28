const mongoose  = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
    local: {
        usuario: String,
        password: String,
        email: {
            type: String,
            unique: true,
            index: true
        },
        friends: [String],
        pending: [String],
        waiting: [String]
    }
});


userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

};

userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);