const Email = require('email-templates');
const path = require('path'),
nodemailer = require('nodemailer');


let transport = nodemailer.createTransport({
host: 'smtp.gmail.com',
port: 465,
secure: true, // true for 465, false for other ports
auth: {
    user: 'support@goatti.ng', // generated ethereal user
    pass: 'goatti2019business' // generated ethereal password
}
})

exports.email = (emailAddress, password, name, template) =>{

   // console.log(__dirname)
const templateDir = path.join(__dirname, 'Emails')
 
const emailService = new Email({
views: { root: templateDir },

send: true,
transport: transport,

});
 
emailService
  .send({
    template: template,
    message: {
      to: emailAddress
    },
    locals: {
      password,
      name
    }
  })
  .then()
  .catch(console.error);

}

exports.emailInquiry = (emailAddress,  name, template) =>{

 // console.log(__dirname)
const templateDir = path.join(__dirname, 'Emails')

const emailService = new Email({
views: { root: templateDir },

send: true,
transport: transport,

});

emailService
.send({
  template: template,
  message: {
    to: emailAddress
  },
  locals: {
    name
  }
})
.then()
.catch(console.error);

}