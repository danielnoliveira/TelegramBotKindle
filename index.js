const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('./src/Database');
const ReaderModel = require('./src/Database/Model/Readers');

const calibre = require('./src/Service/EbookConverter');
const fileManager = require('./src/Service/FileManager');
const postman = require('./src/Service/Postman');

const msgs = require('./src/DefaultTexts/msgs');

const {TELEGRAM_TOKEN} = require('./secrets');

const getURLcomplete = (token,file_path)=>{
    return `https://api.telegram.org/file/bot${token}/${file_path}`;
}

var port = process.env.PORT || 443,
    host = process.env.HOST,
    externalUrl = 'https://glacial-bastion-14919.herokuapp.com/';

const bot = new TelegramBot(TELEGRAM_TOKEN, {polling:false,webHook:{port,host}});
bot.setWebHook(externalUrl+':443/bot'+TELEGRAM_TOKEN);
bot.onText(/\/start/,(msg)=>{
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, msgs.start);
});
bot.onText(/^\/setemail$/,async (msg)=>{
    const chatId = msg.chat.id;
    const reader = await ReaderModel.findOne({chatId}).exec();
    if (reader) {
        bot.sendMessage(chatId,`Email: ${reader.email}`);
    } else {
        bot.sendMessage(chatId,'Email não encontrado. Use o comando "/setemail seu_email" para definir o email do kindle.');
    }
});
bot.onText(/\/setemail (.+)/,async (msg,match)=>{
    const chatId = msg.chat.id;
    const email = match[1];
    if(msg.entities[1].type==="email"){
        bot.sendMessage(chatId,"Esse é um email válido");
        const reader1 = await ReaderModel.findOne({chatId}).exec();
        if(reader1){
            bot.sendMessage(chatId,'Usuario já encontrado. Atualizando email');
            const reader = await ReaderModel.findOneAndUpdate({chatId,email}).exec();
            if (reader) {
                bot.sendMessage(chatId,'Email atualizado com sucesso!!!');
            } else {
                bot.sendMessage(chatId,'Falhar em atualizar o email. Repita a operação');
            }
        }else{
            const newReader = new ReaderModel({email,chatId});
            newReader.save()
            .then(()=>{
                bot.sendMessage(chatId,'Email Salvo com sucesso')
            })
            .catch((err)=>{
                bot.sendMessage(chatId,'Falhar em salvar o email.Repita a operação')
            });
        }
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
        await calibre.EbookConverter('./books/',file_name);
        bot.sendMessage(chatId,'Conversão finalizada.\nO documento está sendo enviado para o seu Kindle.');
        
    }
    const reader = await ReaderModel.findOne({chatId}).exec();
    if(reader){
        bot.sendMessage(chatId,'O documento está sendo enviado para o seu Kindle');
        await postman.sendMailTo(reader.email,file_name);
    }else{
        bot.sendMessage(chatId,'Email não encontrado. Por favor, registre seu email com o comando "/setemail".');
    }
    await fileManager.removeFile(`./books/${file_name}`);
})
