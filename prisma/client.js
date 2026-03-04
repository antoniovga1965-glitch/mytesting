const {PrismaClient}=require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function makeadmin() {
    try {
         await prisma.registered_user.update({
        where:{EMAIL:process.env.ADMIN},
        data:{role:'admin'}
    })
    
    } catch (error) {
        console.error(error)
    }
   
}
makeadmin();
module.exports = prisma;

