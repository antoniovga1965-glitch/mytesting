const africatalking = require('africastalking');

const smstalking = africatalking({
    apiKey:process.env.AFRICANAPI,
    username:process.env.AT_USERNAME,
});

const sms =smstalking.SMS

async function sendsms(phone,message) {
    try {
       const results = await sms.send({

        to:[phone],
        message:message,
       })
       return results
    } catch (error) {
        console.error(error);
        
    }

}

module.exports=sendsms