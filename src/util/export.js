export function exportToExcel(data, columns, fileName) {
    if (!data || data.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }

    let csv = [];

    // 1. Extrai o Cabeçalho (usando a propriedade 'label' das suas colunas)
    const headerRow = columns.map(col => {
        let label = col.label.replace(/"/g, '""'); // Escapa aspas duplas
        return `"${label}"`;
    });
    csv.push(headerRow.join(';'));

    // 2. Extrai os Dados (mapeando a propriedade 'key' de cada coluna)
    data.forEach(row => {
        const rowData = columns.map(col => {
            // Verifica se o valor existe para não imprimir 'undefined' ou 'null'
            let cellValue = row[col.key] !== null && row[col.key] !== undefined 
                ? String(row[col.key]) 
                : "";
            
            // Remove quebras de linha, espaços extras e escapa aspas
            cellValue = cellValue.replace(/(\r\n|\n|\r)/gm, "").trim();
            cellValue = cellValue.replace(/"/g, '""');
            
            return `"${cellValue}"`;
        });
        csv.push(rowData.join(';'));
    });

    // 3. Monta e baixa o arquivo CSV com BOM para caracteres em português (UTF-8)
    const csvData = new Blob(['\uFEFF' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(csvData);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}