const {PrismaClient}=require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function makeadmin() {
    await prisma.registered_user.update({
        where:{EMAIL:process.env.ADMIN},
        data:{role:'admin'}
    })
    
}
makeadmin();
module.exports = prisma;

