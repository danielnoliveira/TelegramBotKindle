const calibre = require('./../src/Service/EbookConverter');

test('Função que converte arquivo em formato epub para o formato mobi', () => {
    return calibre.EbookConverter('./../garbage/','trash.epub',false).then(data=>{
        expect(data).toBe('success');
    });
})
