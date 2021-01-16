var nodemailer = require('nodemailer');
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
    contentType: 'application/x-mobipocket-ebook '
}];

const sendMailTo = (destinatary,file_name) => {

    var attachments = Object.assign({},attachmentsEmpty);
    attachments.filename = file_name;
    attachments.path = `./books/${file_name}`;

    var mailOptions = Object.assign({},mailOptionsEmpty);
    mailOptions.to = destinatary;
    mailOptions.attachments = attachments;

    transporter.sendMail(mailOptions,(error, info) => {
        if(error){
            console.error(error);
        }else{
            console.log(info);
        }
    });
}

module.exports = {
    sendMailTo
}