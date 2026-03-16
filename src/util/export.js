export function exportToExcel(tableSelector, fileName) {
    const tabela = document.querySelector(tableSelector);
    if (!tabela) {
        alert('Tabela não encontrada.');
        return;
    }

    let csv = [];
    const linhas = tabela.querySelectorAll('tr');

    for (let i = 0; i < linhas.length; i++) {
        let linha = [];
        const colunas = linhas[i].querySelectorAll('th, td');
        
        for (let j = 0; j < colunas.length; j++) {
            let texto = colunas[j].innerText.replace(/(\r\n|\n|\r)/gm, "").trim();
            
            texto = texto.replace(/"/g, '""');
            
            linha.push('"' + texto + '"');
        }
        csv.push(linha.join(';'));
    }

    const csvData = new Blob(['\uFEFF' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(csvData);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}