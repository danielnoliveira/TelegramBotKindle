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
    await fs.readFile(`./books/${file_name}`,async (error,data)=>{
        if (error) {
            return console.error(error);
        }
        console.log('Enviando o arquivo',file_name);
        var attachments = [{
            filename: '',
            content: '',
            contentType: 'application/x-mobipocket-ebook'
        }]
        attachments[0].filename = file_name;
        attachments[0].content = data;
        console.log(attachments);
        var mailOptions = Object.assign({},mailOptionsEmpty);
        mailOptions.to = destinatary;
        mailOptions.attachments = attachments;
        mailOptions.text = 'kindle book';
        console.log(mailOptions);
        await transporter.sendMail(mailOptions,(error, info) => {
            if(error){
                console.error(error);
            }else{
                console.log(info);
            }
        });
    });
}

module.exports = {
    sendMailTo
}