const express = require('express');
const router = express.Router();
const multer = require('multer');
const z = require('zod');
const fs = require('fs');
const jwt = require('../middleware');
const tesseract = require('tesseract.js');
const Groq = require('groq-sdk');
const prisma = require('../prisma/client');
require('dotenv').config();
const crypto = require('crypto');

const groq = new Groq({ apiKey: process.env.GROKAPI })


// if(!fs.existsSync('upload'))fs.mkdirSync('upload');
// if(!fs.existsSync('tessdata')) fs.mkdirSync('tessdata'); 
 
const applicantschemas = z.object({
    APPLICANTNAME:z.string().min(1,'Applicants names are required'),
    APPLICANTPHONE:z.string().min(10,'Applicants phone number is required'),
    ADMISSIONNO:z.string().regex(/^([A-Z]+\/\d+\/\d+|\d+)$/),
});

const verfyschemas = (req,res,next)=>{
    const results = applicantschemas.safeParse(req.body);
    if(!results.success){
        return res.status(422).json({message:'Incorrect inputs..try with correct ones'})
    }
    next();

}

const storage = multer.memoryStorage()
    // destination:(req,file,cb)=>cb(null,'upload/'),
    // filename:(req,file,cb)=>{
    //     const filename = file.originalname;
    //     const timestamp = Date.now();
    //     cb(null,`${filename}-${timestamp}`)
    // },



const uploads = multer({
    storage,
    limits:{fileSize:3*1024*1024},
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith('image/')||file.mimetype==='application/pdf'){
            cb(null,true);
        }else{
            cb(new Error('only accepts pdfs and images'))
        }
    }
})

const documentfields=[
    {name:"GUARDIANID",maxCount:1},
    {name:"RESULTSSLIP",maxCount:1},
    {name:"ADMISSIONLETTER",maxCount:1},
    {name:"BIRTHCERT", maxCount:1},   
    {name:"FEESTATEMENT",maxCount:1},
    {name:"CHIEFLETTER",maxCount:1},
    {name:"DEATHCERT",maxCount:1},
];


const parseddocument = (fieldname,text)=>{
    if(fieldname==='GUARDIANID'){
          const idNumber =text.match(/\b\d{6,10}\b/)?.[0] ||text.match(/ID[:\s#]+(\d+)/i)?.[1] || null;
      return {idNumber};
    };

    if(fieldname==='RESULTSSLIP'){
           return {
      name: text.match(/(?:name|student)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || null,
      admissionNo: text.match(/(?:adm|admission)[:\s#]+([A-Z\d\/]+)/i)?.[1] || null,
      grade:
        text.match(/\b([A-E])\b/)?.[1] ||
        text.match(/grade[:\s]+([A-E\+]+)/i)?.[1] ||
        null
    };
    };
    if (fieldname === 'CHIEFLETTER') {
    const keywords = [];
    if (/orphan|no parents|both parents? died/i.test(text)) keywords.push('orphan');
    if (/disciplined|well behaved|good conduct/i.test(text)) keywords.push('disciplined');
    if (/needy|poor|financial difficulty/i.test(text)) keywords.push('needy');
    if (/recommend|support|assist/i.test(text)) keywords.push('recommended');

    return { keywords, hasRecommendation: keywords.includes('recommended') };
  };

   if (fieldname === 'FEESTATEMENT') {
    return {
      name: text.match(/(?:student|name)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || null,
      balance:
        text.match(/(?:balance|due|arrears)[:\s]*k?[shs]?[:\s]*([\d,\.]+)/i)?.[1]?.replace(/,/g, '') ||
        text.match(/([\d,\.]+)\s*(?:dr|cr|balance|due)/i)?.[1]?.replace(/,/g, '') ||
        null
    };
  }

   if (fieldname === 'DEATHCERT') {
    return {
      deathCertNo:
        text.match(/(?:cert|certificate)[.\s#:]+([A-Z\d\/\-]+)/i)?.[1] ||
        text.match(/\b(DC\/\d+\/\d+|\d{6,})\b/i)?.[1] ||
        null
    };
  }

  return {};
}

router.post('/secondaryapplication',uploads.fields(documentfields),verfyschemas,jwt,async(req,res)=>{
const {APPLICANTNAME,APPLICANTPHONE,GENDER,COUNTY,WARD,SCHOOLNAME,YOS,FEEBALANCE,GUARDIANNAME,GUARDIANPHONE,INCOME}=req.body

if(!APPLICANTNAME|| !APPLICANTPHONE||!COUNTY||!SCHOOLNAME||!FEEBALANCE||!GUARDIANNAME||!GUARDIANPHONE||!INCOME){
    return res.status(422).json({message:'fill in the fields theyre required'});
}
else if(!req.files ||Object.keys(req.files).length===0){
      return res.status(422).json({message:'uplaod files first'});
}

try {
    const finaldata = {};
    const files =req.files;
    
    for(const fieldname of Object.keys(files)){
    const file = files[fieldname][0];

    const hashedfing = crypto.createHash('sha256').update(file.buffer).digest('hex');


    const duplicate = await prisma.documentHash.findFirst({
      where:{hash:hashedfing},
    })

    if(duplicate){
        return res.status(422).json({message:`${fieldname} already submited`})
    }

    await prisma.documentHash.create({
        data:{
            hash:hashedfing,
           fieldname:fieldname,
            applicantId:req.user.id
        }
    })

    // Sieve 1: OCR
    const ocrResult = await tesseract.recognize(file.buffer, 'eng',{
          langPath: './tessdata',
        cachePath: './tessdata',
    });
    const rawText = ocrResult.data.text; 

    // Sieve 2: AI clean
   
const airesponse = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
     messages: [
        { role: 'system', content: 'Organize the messy OCR text into structured readable format.' },
        { role: 'user', content: rawText }
    ]
});

const cleandata = airesponse.choices[0].message.content;

// Sieve 3: Parse
finaldata[fieldname] = parseddocument(fieldname, cleandata); 
}

const culcatetotal = (finaldata)=>{
    let score=0
    let total=0

   if(finaldata.GUARDIANID?.idNumber)score++;
   total++;

    if(finaldata.RESULTSSLIP?.grade) score++;
    if(finaldata.RESULTSSLIP?.name) score++;
    total += 2;

    if(finaldata.CHIEFLETTER?.hasRecommendation) score++;
    total++;

    if(finaldata.FEESTATEMENT?.balance) score++;
    total++;

    if(finaldata.BIRTHCERT && Object.keys(finaldata.BIRTHCERT).length > 0) score++;
    total++;


    const totalbase =  Math.round((score / total) * 100);
   
    const orphanbonus = finaldata.DEATHCERT?.deathCertNo?20:0;


     return Math.min(totalbase + orphanbonus, 100);
}
const confidencescore=culcatetotal(finaldata);

const realname = finaldata.RESULTSSLIP?.name;
const realschool = finaldata.FEESTATEMENT?.SCHOOLNAME;
const feebalance = finaldata.FEESTATEMENT?.balance;
const realadmission = finaldata.ADMISSIONLETTER?.admissionNo;

let status = confidencescore>=70? 'pending':'needs_review';

if(!realname &&!realschool &&!feebalance&&!realadmission){
    status="suspicious"
}

const applicants  = await prisma.Applicants.create({
    data:{
     APPLICANTNAME: APPLICANTNAME,
        APPLICANTPHONE: APPLICANTPHONE,
        GENDER: GENDER,
        COUNTY: COUNTY,
        WARD: WARD,
        SCHOOLNAME: SCHOOLNAME,
        YOS: YOS,
        FEEBALANCE: parseFloat(FEEBALANCE),
        GUARDIANNAME: GUARDIANNAME,
        GUARDIANPHONE: GUARDIANPHONE,
        INCOME: INCOME,
        extractedData: finaldata, 
        userId: req.user.id, 
        confidenceScore:confidencescore,
         status:status, 

    },
})
return res.status(201).json({
    message: `Application submitted for ${APPLICANTNAME}`,
    extractedData: finaldata
});
} catch (error) {
    console.log(error);
      return res.status(500).json({ message: 'Processing error' });
    
}

})



module.exports=router
