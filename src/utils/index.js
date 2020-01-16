const sgMail = require('@sendgrid/mail')
const { senderEmail } = require('../config')

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getWelcomeText = (name) => `Welcome to the app, ${name}!`

const getByeText = (name) => `Goodbye, ${name}! I hope to see you back sometime soon.`

const sendEmail = ({
  email,
  subject,
  text,
}) => {
  const msg = {
    to: email,
    from: senderEmail,
    subject,
    text,
  };
  sgMail.send(msg);
}

module.exports = {
  getByeText,
  getWelcomeText,
  sendEmail
}
