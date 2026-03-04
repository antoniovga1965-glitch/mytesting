const express = require('express');
const router = express.Router();
const prisma = require('../prisma/client');
const jwt = require('../middleware');
const axios = require('axios');
const adminsect = require('../admin');




router.get('/totalapplicants',jwt,adminsect,async(req,res)=>{
    try {
    const results = await prisma.Applicants.findMany({
    orderBy:{created_at:'desc'}
     })
    return res.status(200).json({message:results.length})
        
    } catch (error) {
        console.error(error);
         return res.status(500).json({ message: 'Something went wrong' })
    }
    
})


router.get('/universityapplicants',jwt,adminsect,async(req,res)=>{
    try {
    const results = await prisma.university_applicants.findMany({
    orderBy:{created_at:'desc'}
     })
    return res.status(200).json({message:results.length})
        
    } catch (error) {
        console.error(error);
         return res.status(500).json({ message: 'Something went wrong' })
    }
    
})


router.get('/pendingsecondary',jwt,adminsect,async(req,res)=>{
    try {
    const results = await prisma.Applicants.findMany({
    where:{status:'pending'},
    orderBy:{created_at:'desc'},
     })
    return res.status(200).json({message:results.length})
        
    } catch (error) {
        console.error(error);
         return res.status(500).json({ message: 'Something went wrong' })
    }
    
})

router.get('/pendinguniversity',jwt,adminsect,async(req,res)=>{
    try {
    const results = await prisma.university_applicants.findMany({
    where:{status:'pending'},
      orderBy:{created_at:'desc'},
     })
    return res.status(200).json({message:results.length})
        
    } catch (error) {
        console.error(error);
         return res.status(500).json({ message: 'Something went wrong' })
    }
    
})


router.post('/setbudget',jwt,adminsect,async(req,res)=>{
    const {SETBUDGET,FINANCIALYEAR,BUDGETEDCOUNTY} = req.body;
    if(SETBUDGET===""||BUDGETEDCOUNTY===""){
        return res.status(422).json({message:'please honourable fill the fields first'});
    }
    try {
        const response = await prisma.budget.create({
            data:{ 
                SETBUDGET:parseFloat(SETBUDGET),
                FINANCIALYEAR:FINANCIALYEAR,
                BUDGETEDCOUNTY:BUDGETEDCOUNTY,
                }
        })
     return res.status(200).json({message:`budget for ${BUDGETEDCOUNTY}  set succesfully`});

        
    } catch (error) {
        console.log(error);
         return res.status(500).json({message:error});
        
    }
})


router.get('/totalbudget',jwt,adminsect,async(req,res)=>{
    try {
    const response  = await prisma.budget.findMany({
    orderBy:{created_at:'asc'}
    })
    return res.status(200).json({message:response})
    } catch (error) {
        console.error(error);
        
        return res.status(500).json({message:'Something went wrong'});
    }
    
})

router.get('/displaysec',jwt,adminsect,async(req,res)=>{
    try {
        const results = await prisma.Applicants.findMany({
        orderBy:{created_at:'asc'},
    });
    return res.status(200).json({message:results});
    } catch (error) {
       return res.status(500).json({message:'something went wrong'});  
    }
   
    
})


router.get('/universitytable',jwt,adminsect,async(req,res)=>{
    try {
        const results = await prisma.university_applicants.findMany({
        orderBy:{created_at:'asc'},
    });
    return res.status(200).json({message:results});
    } catch (error) {
       return res.status(200).json({message:'something went wrong'});  
    }
   
    
})

router.get('/regtableuni',jwt,adminsect,async(req,res)=>{
    try {
         const response = await prisma.registered_user.findMany({
        orderBy:{created_at:'desc'},
    })
    return res.status(200).json({message:response});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:'Something went wrong'});
    }
   
})

router.get('/searchfunc',jwt,adminsect,async(req,res)=>{
    const {SearchEl} = req.query;
    if(SearchEl===""){
         return res.status(422).json({message:'Please search by name first'});

    }
    try {
         const searcheredresults = await prisma.Applicants.findMany({
        where:{APPLICANTNAME:{
            contains:SearchEl,
             mode: 'insensitive',
        }},
    })
    return res.status(200).json({message:searcheredresults});

    } catch (error) {
        return res.status(500).json({message:'something went wrong'});
    }
})

router.get('/filterstatus',jwt,async(req,res)=>{
    const {status}= req.query;
    try {
        const results= await prisma.applicants.findMany({
     where:status==='all'? {} : { status }, 
     orderBy: { created_at: 'desc' },
    })  
     return res.status(200).json({ message: results })
    } catch (error) {
            return res.status(500).json({ message: 'Something went wrong' })

    }


})
   
module.exports =router