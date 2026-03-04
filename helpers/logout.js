const express = require('express');
const router = express.Router();
const cookieparser = require('cookie-parser');
const winston = require('winston');

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




router.post('/logout',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        sameSite:'lax',
        secure:false
    });
    logger.info('you have logged out succesfully');
    return res.status(200).json({ message: 'Logged out successfully ' })
})


router.post('/logoutadmin',(req,res)=>{
    res.clearCookie('token',{
        httpOnly:true,
        sameSite:'lax',
        secure:false
    });
    logger.info('you have logged out succesfully');
    return res.status(200).json({ message: 'Logged out successfully ' })
}) 

module.exports =router;