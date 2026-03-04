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
const winston = require('winston');

const crypto = require('crypto');

const groq = new Groq({ apiKey: process.env.GROKAPI })

if(!fs.existsSync('universitydocs'))fs.mkdirSync('universitydocs');
if(!fs.existsSync('tessdata')) fs.mkdirSync('tessdata'); 
 
const applicantschemas = z.object({
    NAMES:z.string().min(1,'Applicants names are required'),
    UNIPHONENO:z.string().min(10,'Applicants phone number is required'),
      UNIWARD: z.string().min(1,'Ward is required'),
    UNICOUNTY:z.string().min(1,'Your county name is required'),
      UNIVERSITYNAME: z.string().min(1,'University name is required'),
    REGNO:z.string().regex(/^([A-Z]+\/\d+\/\d+|\d+)$/),
});

const verifyschemas = (req,res,next)=>{
    const results = applicantschemas.safeParse(req.body);
    if(!results.success){
        return res.status(422).json({message:'Incorrect inputs..try with correct ones'})
    }
    next();

}

const storage = multer.memoryStorage({});
    // destination:(req,file,cb)=>cb(null,'universitydocs/'),
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

const uploadeddocuments=[
    {name:"IDCOPY",maxCount:1},
    {name:"RESULTSCOPY",maxCount:1},
    {name:"ADMISSIONLETTER",maxCount:1},
    {name:"BIRTHCERT",maxCount:1},
    {name:"CHIEFLETTER",maxCount:1},
    {name:"FEESTATEMENT",maxCount:1},
    {name:"DEATHCERT",maxCount:1},
];

const parseddocumentsdata = (fieldname,text)=>{
    
    if(fieldname === 'IDCOPY'){
        return {
            name: text.match(/(?:name|full name)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || null,
            idNumber: text.match(/\b\d{6,10}\b/)?.[0] || 
                      text.match(/ID[:\s#]+(\d+)/i)?.[1] || null,
            placeOfBirth: text.match(/(?:place of birth|birth place|district)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || null,
            dateOfBirth: text.match(/(?:date of birth|dob|born)[:\s]+([\d\/\-\.]+)/i)?.[1] || 
                         text.match(/\b(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\b/)?.[1] || null,
        }
    }

    
    if(fieldname === 'RESULTSCOPY'){
        return {
            name: text.match(/(?:name|student)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || null,
            gpa: text.match(/(?:gpa|grade point|average)[:\s]+([\d\.]+)/i)?.[1] ||
                 text.match(/\b([0-4]\.\d{1,2})\b/)?.[1] || null,
        }
    }

    if(fieldname === 'ADMISSIONLETTER'){
        return {
            institutionName: text.match(/(?:university|college|institute|polytechnic)[:\s]*([A-Za-z\s]+)/i)?.[1]?.trim() ||
                             text.match(/(?:institution|school)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || null,
            admissionNo: text.match(/(?:adm|admission|reg|registration)[:\s#.]+([A-Z\d\/\-]+)/i)?.[1] || null,
        }
    }

    if(fieldname === 'BIRTHCERT'){
        return {
            name: text.match(/(?:name|full name|names)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || null,
            dateOfBirth: text.match(/(?:date of birth|dob|born|birth date)[:\s]+([\d\/\-\.]+)/i)?.[1] ||
                         text.match(/\b(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\b/)?.[1] || null,
        }
    }

    if(fieldname === 'CHIEFLETTER'){
        const keywords = []
        if(/orphan|no parents|both parents? died/i.test(text)) keywords.push('orphan')
        if(/disciplined|well behaved|good conduct/i.test(text)) keywords.push('disciplined')
        if(/needy|poor|financial difficulty/i.test(text)) keywords.push('needy')
        if(/recommend|support|assist/i.test(text)) keywords.push('recommended')

        return {
            keywords,
            hasRecommendation: keywords.includes('recommended')
        }
    }


    if(fieldname === 'DEATHCERT'){
        return {
            deathCertNo: text.match(/(?:cert|certificate)[.\s#:]+([A-Z\d\/\-]+)/i)?.[1] ||
                         text.match(/\b(DC\/\d+\/\d+|\d{6,})\b/i)?.[1] || null,
            nameOfDeceased: text.match(/(?:deceased|name of deceased|name)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() ||
                            text.match(/(?:the late|late)[:\s]+([A-Za-z\s]+)/i)?.[1]?.trim() || null,
        }
    }

    return {}

}


router.post('/universityapplication',uploads.fields(uploadeddocuments),verifyschemas,jwt,async(req,res)=>{
    const {NAMES,UNIPHONENO,UNICOUNTY,UNIWARD,UNIVERSITYNAME,REGNO}  =req.body;

    if(!NAMES ||!UNIPHONENO||!UNICOUNTY||!UNIWARD||!UNIVERSITYNAME||!REGNO){
        return res.status(422).json({message:'fill in the required fields first'});
        logger.info(`${NAMES} tried to submiy eith empty fields`)

    }else if(!req.files||Object.keys(req.files).length===0){
        return res.status(422).json({message:'files are required before submitting'})
    }

    
    try {
        const finaldata={};
        const files = req.files;
        

        for(const fieldname of Object.keys(files)){
            const file = files[fieldname][0]

            const hasheddoc=crypto.createHash(fieldname).update(file.buffer).digest('hex');

            const duplicate = await prisma.universitydocumentHash.findFirst({
                where:{hash:hasheddoc},
            })

            if(duplicate){
                return res.status(400).json({message:`${fieldname} already submitted`})
            }

             await prisma.universitydocumentHash.create({
            data:{
            hash:hasheddoc,
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

    let cleandata = rawText  
      try {
        const airesponse = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
     messages: [
        { role: 'system', content: 'Organize the messy OCR text into structured readable format.' },
        { role: 'user', content: rawText }
    ]
      });
       cleandata = airesponse.choices[0].message.content;
    }
    catch(aiError){
         console.log(`AI failed for ${fieldname}:`, aiError.message);
         logger.error(aiError);
        
    }

 // Sieve 3: Parse
finaldata[fieldname] = parseddocumentsdata(fieldname, cleandata); 
}

const culcatetotalscore = finaldata=>{
    let score=0
    let total=0

   if(finaldata.IDCOPY?.idNumber)score++;
   total++;

    if(finaldata.RESULTSCOPY?.grade) score++;
    if(finaldata.RESULTSCOPY?.name) score++;
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
        const confidencescore=culcatetotalscore(finaldata);

const realname = finaldata.IDCOPY?.name;
const realschool = finaldata.FEESTATEMENT?.institutionName;
const feebalance = finaldata.FEESTATEMENT?.balance;
const realadmission = finaldata.ADMISSIONLETTER?.admissionNo;

let status = confidencescore>=70? 'pending':'needs_review';

if(!realname &&!realschool &&!feebalance&&!realadmission){
    status="suspicious"
}
const applicants = await prisma.university_applicants.create({
    data:{
         NAMES: NAMES,
        UNIPHONENO: UNIPHONENO,
        UNICOUNTY: UNICOUNTY,
        UNIWARD: UNIWARD,
        UNIVERSITYNAME: UNIVERSITYNAME,
        REGNO: REGNO,
        extractedData: finaldata, 
        userId: req.user.id, 
        confidenceScore:confidencescore,
         status:status, 

    }
})
return res.status(201).json({message:`${NAMES} application went succesfully wait for processing`})
logger.info(`${NAMES} applied succesfully`)
        
    } catch (error) {
        console.error(error);
        logger.error(error);
        return res.status(500).json({message:'somwthing went wrong try again'});
    }
})


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

logger.error()
logger.info();

module.exports=router