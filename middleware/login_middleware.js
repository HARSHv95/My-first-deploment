const jwt = require('jsonwebtoken');

const login = async(req, res, next)=>{
    const header = req.headers['authorization'];
    const token = header && header.split(" ")[1];

    if(!token){
        return res.status(400).json({
            success : false,
            message : 'Please login first to visit the home page!!!'
        });
    };

    try{
        const user = jwt.verify(token,process.env.JWT_SECRETKEY);
        req.userInfo = user;
        next();
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : e.message
        });
    }
};

module.exports = {login};