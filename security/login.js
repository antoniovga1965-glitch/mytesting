const express = require('express');
const router = express.Router();
const winston = require('winston');
const cookieparser  =require('cookie-parser');
const prisma = require('../prisma/client');
const jwt = require('jsonwebtoken');
const limitor = require('express-rate-limit');
const bcrypt = require('bcrypt');
require('dotenv').config();


const logger = winston.createLogger({
    level:'debug',
    format:winston.format.combine(

    winston.format.timestamp(),
    winston.format.printf(({timestamp,level,message})=>{
return `${timestamp} :[${level.toLocaleUpperCase()}]:${message}`
    })
),
transports:[
    new winston.transports.Console(),
    new winston.transports.File({filename:"app.log"})
]
});


const limit = limitor({
    windowMs:15*60*1000,
    max:30,
    message:{message:'Too many attempts try again later'},
});

router.post('/login',limit,async(req,res)=>{
    const {USERNAMELOGIN,PASSWORDLOGIN} = req.body;
    
    if(!USERNAMELOGIN || !PASSWORDLOGIN){
        logger.warn(`${USERNAMELOGIN} user tried to acces with empty fields`)
        return res.status(422).json({message:'Fill in the required fields'})
        
    }
    try {
        const username = await prisma.registered_user.findUnique({
            where:{EMAIL:USERNAMELOGIN},
        })
        if(!username){
            logger.info(`${USERNAMELOGIN} doesnt exist`);
            return res.status(401).json({message:'user not found'});
            
        }
        const match = await bcrypt.compare(PASSWORDLOGIN,username.hashedpassword);
        if(!match){
             logger.info('password doesnt match');
           return res.status(401).json({message:"incorrect password try again"})
          
        }

        const token = jwt.sign({  id: username.id,
            email: username.EMAIL,
            role:username.role},process.env.SECRET_KEY,
            {expiresIn:process.env.EXPRIRES});

        res.cookie('token',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'lax',
        })
        logger.info(`${USERNAMELOGIN} logged in succesfully`);
         return res.status(200).json({message:`${USERNAMELOGIN} you have logged in succesfully wait for redirecting`,role:username.role});
         
        
    } catch (error) {
        logger.error(error);
        return res.status(500).json({message:error})
    }
})   
        
module.exports = router;