const TelegramBot = require('node-telegram-bot-api');
const ebookConverter = require("node-ebook-converter");
ebookConverter.setPoolSize(10);
const fileManager = require('./src/Service/FileManager');
const msgs = require('./src/DefaultTexts/msgs');

const {TELEGRAM_TOKEN} = require('./TokenBot');

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
    console.log(msg);
    const email = match[1];
    if(msg.entities[1].type==="email"){
        bot.sendMessage(chatId,"Esse é um email válido");
    }else{
        bot.sendMessage(chatId,"Isso não é um email");
    }
});

bot.on('document', async (msg)=>{
    const chatId = msg.chat.id;
    const file_name = msg.document.file_name;
    const {file_path} = await bot.getFile(msg.document.file_id);
    await fileManager.downloadFile.download(getURLcomplete(TELEGRAM_TOKEN,file_path),`./books/${file_name}`,(err)=>console.log(err?err:'tudo certo'));
    if(file_name.slice(-4)==='epub'){
        ebookConverter.convert({
            input:`./books/${file_name}`,
            output:`./books/${file_name.slice(0,-5)}.mobi`,
        }).then(response => console.log(response))
        .catch(error=>console.log(error));
    }
    bot.sendMessage(chatId,'Documento enviado para o seu Kindle');
})