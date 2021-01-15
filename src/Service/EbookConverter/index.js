const ebookConverter = require("node-ebook-converter");
ebookConverter.setPoolSize(10);

const EbookConverter = async (file_name) => {
    console.log('Iniciando conversão');
    await ebookConverter.convert({
        input:`./books/${file_name}`,
        output:`./books/${file_name.slice(0,-5)}.mobi`,
        delete:true,
        silent:true
    });
    console.log('Conversão finalizada');
}



module.exports = {
    EbookConverter
}
