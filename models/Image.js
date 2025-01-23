const mongoose = require('mongoose');

const Image = new mongoose.Schema({
    url : {
        type : String,
        required : true
    },

    publicID : {
        type : String,
        required : true
    },

    uploadedBy : {
        type : String,
        ref : 'user',
        required : true
    }
});

module.exports = mongoose.model('Image', Image);