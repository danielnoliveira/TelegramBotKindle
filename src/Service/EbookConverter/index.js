const ebookConverter = require("node-ebook-converter");
ebookConverter.setPoolSize(10);

const EbookConverter = async (file_path,file_name,del=true) => {
    try{
        console.log('Iniciando conversão');
        await ebookConverter.convert({
            input:`${file_path}${file_name}`,
            output:`${file_path}${file_name.slice(0,-5)}.mobi`,
            delete:del,
            silent:true
        });
        console.log('Conversão finalizada');
        return 'success';
    }catch(e){
        console.log('Falha na conversão');
        console.error(e);
        return 'fail'
    }
}



module.exports = {
    EbookConverter
}
