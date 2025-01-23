const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const {uploadToCloudinary} = require('../helper/cloudinaryHelper');  
const Image = require('../models/Image'); 
const cloudinary = require('../config/cloudinary');

const login_user = async(req, res)=>{
    try{
        const logincreds = req.body;
        const username = logincreds.username;
        const email = logincreds.email;

        const checkUser = await User.findOne({$or : [{username}, {email}]});
        
        if(!checkUser){
            return res.status(400).json({
                success : false,
                message : "The user is not registered!!! Register first!"
            });
        };

        const pass = await bcryptjs.compare(logincreds.password, checkUser.password);

        if(!pass){
            return res.status(400).json({
                succcess : false,
                message : "Incorrect Password!!!"
            });
        };

        const accesstoken = jwt.sign({
            username : checkUser.username,
            email : checkUser.email,
            role : checkUser.role,
            userID : checkUser._id
        },process.env.JWT_SECRETKEY, {
            expiresIn : '5m'
        })

        res.status(200).json({
            success : true, 
            message : `Login Successfull!!! Welcome ${username} :)`,
            token : accesstoken
        })
    }
    catch(e){
        res.status(500).json({
            success : false,
            messsage : e.message
        });
    }
};

const register_user = async(req, res)=>{
    try{
        const {username, email, password, role} = req.body;
        const checkexistingUser = await User.findOne({$or : [{username}, {email}]});

        if(checkexistingUser){
            return res.status(400).json({
                success : false,
                message : "User already registered having the email or username!!! Please login or try a different one!"
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const registeredUser = await User.create({
            username : username,
            email : email,
            password : hashedPassword,
            role : role
        });

        res.status(200).json({
            success : true,
            message : "User registered successfully!!!!",
            user : registeredUser
        })

        
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : e.message
        });
    }
};

const home_login = async(req, res)=>{
    const userCreds = await req.userInfo;

    res.status(200).json({
        success : true,
        message : `Welcome to Home Page!!! ${userCreds.username}`
    })
};

const upload_image = async(req, res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                success : false,
                message : 'File not Found!!! Please upload the file first!'
            });
        }

        const {url, publicID} = await uploadToCloudinary(req.file.path);

        const uploadImage = new Image({
            url : url,
            publicID : publicID,
            uploadedBy : req.userInfo.username
        });

        await uploadImage.save();

        res.status(201).json({
            success : true,
            message : 'File uploaded successfully!!!!!',
            uploadedImage : uploadImage
        });
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : e.message
        });
    }
}

const changePassword = async(req, res)=>{
    try{
        const userCreds = req.userInfo;
        const {newpassword} = req.body;
        
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newpassword, salt);

        const updateUser = await User.findByIdAndUpdate(userCreds.userID, {$set : {password : hashedPassword}});

        res.status(201).json({
            success : true,
            message : 'Password changed Successfully!!!',
            data : updateUser
        });
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : e.message
        });
    }
};

const deleteImage = async(req, res)=>{
    try{
        const getIdofimagetodelete = req.params.id;
        const user = req.userInfo.username;

        const imagetodelete = await Image.findById(getIdofimagetodelete);

        if(!imagetodelete){
            return res.status(400).json({
                success : false,
                message : "Image not found!!!"
            });
        };

        if(imagetodelete.uploadedBy !== user){
            return res.status(403).json({
                success : false,
                message : "You are not authorized to delete the image because you didn't uploaded the image!!!"
            });
        };

        await cloudinary.uploader.destroy(imagetodelete.publicID);

        await Image.findByIdAndDelete(getIdofimagetodelete);

        res.status(201).json({
            success : true,
            message : "Iamge deleted successfully!!!",
            deletedImage : imagetodelete
        });
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : e.message
        });
    }
}

const fetchallImage = async(req, res)=>{
    try{
        const page = req.query.page || 1;
        const limit  = req.query.limit || 3;
        const skip = (page-1)*limit;
        
        const totalImages = await Image.countDocuments();
        const totalPages = await Math.ceil(totalImages/limit);

        const Images = await Image.find().skip(skip).limit(limit);

        res.status(201).json({
            success : true,
            message : `All images uploaded by ${req.userInfo.username}!!!!`,
            page : page,
            totalpages : totalPages,
            images : Images
        })
    }
    catch(e){
        res.status(500).json({
            success : false,
            message : e.message
        });
    }
}

module.exports = {login_user, register_user, home_login, upload_image, changePassword, deleteImage, fetchallImage};