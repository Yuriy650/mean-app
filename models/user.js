const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');
const {log} = require("nodemon/lib/utils");

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByLogin = function (login, callback) {
    const query = {login};
    User.findOne(query)
}

module.exports.getUserById = function (id, callback) {
    User.findById(id)
}

module.exports.addUser = function (newUser) {
    console.log(newUser)
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt,async (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            await newUser.save().then(() => console.log(newUser));
        })
    })
}

module.exports.comparePass = function (passFromUser, userDBPass, callback) {
    bcrypt.compare(passFromUser, userDBPass, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}
