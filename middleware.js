const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');

const verifyjwt = (req,res,next)=>{
    const token =req.cookies.token;
    if(!token){
        return res.status(404).json({message:"No Token found"});
    }
    try {
        const auth = jwt.verify(token,process.env.SECRET_KEY);
        req.user=auth;
        next();
    } catch (error) {
        return res.status(422).json({message:'invalid token'})
    }
}


module.exports=verifyjwt