const TelegramBot = require('node-telegram-bot-api');
var http = require('https');
var fs = require('fs');
const {TELEGRAM_TOKEN} = require('./TokenBot');
const getURLcomplete = (token,file_path)=>{
    return `https://api.telegram.org/file/bot${token}/${file_path}`;
}
var download = async function(url, dest, cb) {
    var file = await fs.createWriteStream(dest);
    await http.get(url, async function(response) {
        await response.pipe(file);
        await file.on('finish', async function() {
            await file.close(cb);
        });
    });
}
const bot = new TelegramBot(TELEGRAM_TOKEN, {polling:true});

bot.onText(/\/start (.+)/,(msg,match)=>{
    const chatId = msg.chat.id;
    const resp = match[1];
    console.log(msg);
    bot.sendMessage(chatId, 'Ola');
});

bot.on('document', async (msg)=>{
    const chatId = msg.chat.id;
    const file_name = msg.document.file_name;
    console.log(msg);
    const {file_path} = await bot.getFile(msg.document.file_id);
    await download(getURLcomplete(TELEGRAM_TOKEN,file_path),`./${file_name}`,(err)=>console.log(err?err:'tudo certo'));
    bot.sendMessage(chatId,'Recebi seu documento');
})