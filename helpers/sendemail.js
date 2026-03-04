const crypto = require('crypto');
const transporter = require('../helpers/email');
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const path =require('path');
const bcrypt = require('bcrypt');
const smsfunction = require('../helpers/sms')

router.post('/passwordreset',async(req,res)=>{
    const {emailreset} =req.body;
       
    try {
        
    const user = await prisma.registered_user.findUnique({
        where:{EMAIL:emailreset}
    })

    if(!user){
        return res.status(422).json({message:'email doesnt exist'});
    }

    const token = crypto.randomBytes(32).toString('hex');
    await prisma.registered_user.update({
        where:{EMAIL:emailreset},
        data:{
            token,
            resetTokenExpiry:new Date(Date.now()+3600000),
        }

    })
await transporter.sendMail({
    from:process.env.EMAILUSER,
    to:emailreset,
    subject:'smart bursary reset password',
    html:`
    <h2>Password reset</h2>,
    <p>Click in the link to reset the password</p>
     <a href="${process.env.FRONTENDURL}/resetpassword?token=${token}">Reset password</a>
     <p>link expires in 1 hour</p>
    `
})
res.status(200).json({message:'link reset succesfully'})

    } catch (error) {
        console.error(error)
    }


})

router.get('/', (req, res) => {
res.sendFile(path.join(__dirname,'../public/passwordreset.html'))
})

router.post('/savenewpassword',async(req,res)=>{
    const {token,PASSWORD}  =req.body;

    try {
         const user = await prisma.registered_user.findFirst({
        where:{
            token,
            resetTokenExpiry:
            {gt:new Date()}
        }
    })
    if(!user){
        return res.status(422).json({message:'User not found or token expired'});
    }
     const savednewpass = await bcrypt.hash(PASSWORD,12);
     await prisma.registered_user.update({
        where:{id:user.id},
        data:{
              hashedpassword:savednewpass,
            token:null,
            resetTokenExpiry:null,
        }
     })
     return res.status(200).json({message:'password set succefully'});
    } catch (error) {
        return res.status(500).json({message:'something went wrong try again'}); 
    }
   
    
})



router.get('/testsms',async(req,res)=>{
    await smsfunction('+254727669032','testing real bursary in kenya');
 return res.status(200).json({message:'sms sent check for verifiation'});
})


module.exports=router


