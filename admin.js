const admincheck=(req,res,next)=>{
    if(req.user.role!=='admin'){
        return res.status(403).json({message:'acces denied'});
    }
    next();
}
module.exports=admincheck;