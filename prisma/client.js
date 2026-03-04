const {PrismaClient}=require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function makeadmin() {
    try {
        const user = await prisma.registered_user.findFirst({
            where: { EMAIL: process.env.ADMIN }
        })
        
        if(user) {
            await prisma.registered_user.update({
                where: { EMAIL: process.env.ADMIN },
                data: { role: 'admin' }
            })
        }
    } catch (error) {
        console.error('makeadmin skipped:', error.message)
    }
}
makeadmin();
module.exports = prisma;

