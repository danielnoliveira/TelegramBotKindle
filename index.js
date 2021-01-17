const TelegramBot = require('node-telegram-bot-api');

const ReaderModel = require('./src/Database/Model/Readers');

const calibre = require('./src/Service/EbookConverter');
const fileManager = require('./src/Service/FileManager');
const postman = require('./src/Service/Postman');

const msgs = require('./src/DefaultTexts/msgs');

const {TELEGRAM_TOKEN} = require('./secrets');

const getURLcomplete = (token,file_path)=>{
    return `https://api.telegram.org/file/bot${token}/${file_path}`;
}

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling:true});

bot.onText(/\/start/,(msg)=>{
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, msgs.start);
});
bot.onText(/\/setemail (.+)/,(msg,match)=>{
    const chatId = msg.chat.id;
    const email = match[1];
    if(msg.entities[1].type==="email"){
        bot.sendMessage(chatId,"Esse é um email válido");
        const newReader = new ReaderModel({email,chatId});
    }else{
        bot.sendMessage(chatId,"Isso não é um email");
    }
});

bot.on('document', async (msg)=>{
    const chatId = msg.chat.id;
    const file_name = msg.document.file_name;
    const {file_path} = await bot.getFile(msg.document.file_id);
    await fileManager.download(getURLcomplete(TELEGRAM_TOKEN,file_path),`./books/${file_name}`);
    if(file_name.slice(-4)==='epub'){
        bot.sendMessage(chatId,'Documento não está em formato mobi. Iniciando conversão para o formato mobi.');
        await calibre.EbookConverter(file_name);
        bot.sendMessage(chatId,'Conversão finalizada.\nO documento está sendo enviado para o seu Kindle.');
        
    }
    const {email} = await ReaderModel.findOne({chatId});
    if(email){
        bot.sendMessage(chatId,'O documento está sendo enviado para o seu Kindle');
        await postman.sendMailTo(email,file_name);
    }else{
        bot.sendMessage(chatId,'Email não encontrado. Por favor, registre seu email com o comando "/setemail".');
    }
})
