const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username : {
        type : String,
        require : true,
        unique : true
    },

    email : {
        type : String,
        require : true,
        unique : true
    },

    password : {
        type : String,
        require : true,
    },

    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    }
});

module.exports = mongoose.model('User', User);