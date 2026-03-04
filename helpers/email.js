const { Resend } = require('resend')

function getResend() {
  return new Resend(process.env.RESENDAPI)
}

module.exports = getResend