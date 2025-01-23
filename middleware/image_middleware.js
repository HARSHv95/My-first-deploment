const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, '/Web-Development/NodeJs/Authe-Autho-1/uploads')
    },
    filename : function(req, file,cb){
        cb(null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        )
    }
});

const checkFilter = (req, file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    }
    else{
        cb(new Error('Not an Image!! Only upload images!'))
    }
};

module.exports = multer({
    storage : storage,
    fileFilter : checkFilter,
    limits : {
        fieldSize : 5*1024*1024 //5MB file size
    }
});