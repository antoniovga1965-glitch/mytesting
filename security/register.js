const express = require('express');
const router = express.Router();
const bcrypt =require('bcrypt');
const z= require('zod');
const prisma = require('../prisma/client');


const registerschemas = z.object({
    NAMES:z.string().min(1,'Your names are  required'),
    EMAIL:z.string().email('invalid email address'),
    PHONE:z.string().min(10,'Fill in with correct phone number'),
    PASSWORD:z.string().min(6,'fill with your password atleast 6 characters'),

})

const schemas =(req,res,next)=>{
    const results  = registerschemas.safeParse(req.body);
    if(!results.success){
        return res.status(422).json({message:'Please fill in the registration form with correct details'})
    }
    next();
}

router.post('/registration',schemas,async(req,res)=>{
const {NAMES,EMAIL,PHONE,PASSWORD}=req.body;
if(!NAMES ||! EMAIL||!PHONE||!PASSWORD){
    return res.status(422).json({message:'Fill in the fields with the correct details first'});
}

try {
const exist = await prisma.registered_user.findUnique({
    where:{EMAIL:EMAIL}
});
if(exist){
res.status(409).json({message:'user already exists'});
}

const saltrounds = 12
const hashedpassword = await bcrypt.hash(PASSWORD,saltrounds)
const savedb = await prisma.registered_user.create({
    data:{NAMES,EMAIL,PHONE,hashedpassword}
})

return res.status(200).json({message:`Dear,${NAMES} your have been succesfully registered into smart bursary system wait for redirecting`})
    
} catch (error) {
    console.error(error)
    return res.status(500).json({message:'Something went wrong check and try again'})
}

})
module.exports=router;