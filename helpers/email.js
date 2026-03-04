const { Resend } = require('resend')

const resend = new Resend(process.env.RESENDAPI)
module.exports = resend