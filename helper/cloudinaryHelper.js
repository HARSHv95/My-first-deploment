const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async(filepath)=>{
    try{
        const result = await cloudinary.uploader.upload(filepath);

        return{
            url : result.secure_url,
            publicID : result.public_id
        };
    }
    catch(e){
        console.log('Failed to upload to cloudinary!!!');
        throw new Error('Failed to upload to cloudinary!!!');
    }
}

module.exports = {uploadToCloudinary};