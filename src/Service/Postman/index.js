var nodemailer = require('nodemailer');
const fs = require('fs');
const {pass_email} = require('./../../../secrets');
var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
        ciphers:'SSLv3'
    },
    auth: {
        user:'the.postman.of.books@outlook.com',
        pass:pass_email
    }
});
var mailOptionsEmpty = {
    from: 'the.postman.of.books@outlook.com',
    to:'',
    attachments:[]
}
// attachments
var attachmentsEmpty =[{
    filename: '',
    path: '',
    contentType: 'application/x-mobipocket-ebook'
}];

const sendMailTo = async (destinatary,file_name) => {
    return new Promise((resolve,reject)=>{
        var attachments = [{
            path:`./books/${file_name}`,
            contentType: 'application/x-mobipocket-ebook'
        }]
            
        var mailOptions = Object.assign({},mailOptionsEmpty);
        mailOptions.to = destinatary;
        mailOptions.attachments = attachments;
        mailOptions.text = 'kindle book';
        
        transporter.sendMail(mailOptions,(error, info) => {
            if(error){
                console.error(error);
                reject('fail')
            }else{
                console.log(info);
                resolve('success');
            }
        });
    });
}

module.exports = {
    sendMailTo
}