// Função auxiliar para renderizar uma célula
export function renderCell(col, row) {
    const value = col.fmt ? col.fmt(row[col.key], col.qtdDecimal, row) : row[col.key];
    return value ?? "";
}

// ==========================================
// 1. GERAÇÃO HTML (Renderização Inicial)
// ==========================================

export function criarTabela(dados, config) {
    if (!dados || dados.length === 0) {
        return "<p>Nenhum dado encontrado.</p>";
    }

    const temRodape = typeof config.renderFooter === 'function';

    return `  
        <div class="table-scroll-wrap">
            <table id="${config.tableId || 'tabela-generica'}" class="tabela-conferencia">
                <thead>
                    <tr>
                        ${config.cols.map(col => `
                            <th class="align-${col.align} sortable-th th-filterable" data-col="${col.key}">
                                <span class="th-label">${col.name}</span>
                                <i class="fas fa-sort sort-icon" style="opacity: 0.3; margin-left: 5px;"></i>
                                <button type="button" class="col-filter-btn" data-col="${col.key}" title="Filtrar">
                                    <i class="bi bi-funnel-fill"></i>
                                </button>
                            </th>  
                        `).join("")}
                    </tr>
                </thead>
                <tbody id="tbody-${config.tableId || 'generico'}">
                    ${renderRowsHTML(dados, config)}
                </tbody>
            </table>
        </div>
        ${temRodape ? `<div id="footer-${config.tableId || 'generico'}-container">${config.renderFooter(dados)}</div>` : ''}
    `;
}

// Renderiza apenas as linhas (usado na inicialização e nas atualizações)
export function renderRowsHTML(dados, config) {
    if (dados.length === 0) {
        return `
            <tr>
                <td colspan="${config.cols.length}" class="no-filtered-results">
                    <i class="bi bi-search"></i> Nenhum registro atende aos filtros.
                </td>
            </tr>
        `;
    }
    return dados.map(row => {
        // Injeta os data-attributes dinamicamente baseados na config
        const dataAtributos = config.dataKeys 
            ? config.dataKeys.map(key => `data-${key.toLowerCase()}="${row[key]}"`).join(" ") 
            : "";

        return `
            <tr ${dataAtributos} class="linha-principal ${config.expandable ? 'clicavel' : ''}">
                ${config.cols.map(col => `<td class="align-${col.align}">${renderCell(col, row)}</td>`).join("")}
            </tr>    
        `;
    }).join("");
}