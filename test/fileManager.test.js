const fileManager = require('./../src/Service/FileManager');

const url_file_download_test = "https://gist.github.com/khaykov/a6105154becce4c0530da38e723c2330/archive/41ab415ac41c93a198f7da5b47d604956157c5c3.zip";


test('Função de download de arquivo',  () => {
    return expect(fileManager.download(url_file_download_test,'./garbage/file.zip')).resolves.toBe('success');
})

test('Função de remover arquivo', () => {
    return fileManager.removeFile('./garbage/file.zip').then(data =>{
        expect(data).toBe('success');
    });
})
