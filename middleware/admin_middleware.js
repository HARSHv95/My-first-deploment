
const admin = async(req, res, next)=>{
    try{
        const userCreds = req.userInfo;

        if(userCreds.role !== 'admin'){
            return res.status(400).json({
                success : false,
                message : "Only admins are allowed!!!!"
            });
        };

        next();

    }
    catch(e){
        res.status(500).json({
            success : false,
            message : e.message
        });
    };

}

module.exports = {admin};