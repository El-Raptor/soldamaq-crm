import { fmtNumber, fmtDate, fmtBRL } from "../util/data-format-utils.js";
import { criarTabela } from "../components/table.js";

let days = "60";
export const getColsCustomers = (days, isInactive = false) => {
    const sufixoChave = isInactive ? "" : `_${days}D`;
    const sufixoTitulo = isInactive ? "" : ` ${days} Dias`;

    return [
        { 
            key: "ACOES", 
            name: "", 
            align: "center", 
            fmt: (val, dec, row) => `<button type="button" class="btn-nivel row-action-btn" data-codparc="${row.CODPARC}">Ver Grupos</button>` 
        },
        { key: "NOMEPARC", name: "Nome", align: "left" },
        { key: "CODPARC", name: "Código", align: "center" },
        { key: `MAIORORC${sufixoChave}`, name: `Maior Orçamento${sufixoTitulo}`, fmt: fmtBRL, align: "right" },
        { key: `TOTALVENDAS${sufixoChave}`, name: `Total de Vendas${sufixoTitulo}`, fmt: fmtBRL, align: "right" },
        { key: `ORCACUM${sufixoChave}`, name: "Orçamento Acumulado", fmt: fmtBRL, align: "right" },
        { key: "VLRORCPEN", name: "Orçamento Pendente", fmt: fmtBRL, align: "right" },
        { key: "ULT_VENDA", name: "Última Venda", fmt: fmtDate, align: "center" },
        { key: "ULT_ORC", name: "Último Orçamento", fmt: fmtDate, align: "center" },
        { key: "TELEFONE", name: "Telefone", align: "left" },
        { key: "EMAIL", name: "E-mail", align: "left" },
        { key: "ULTVENDEDOR", name: "Último Vendedor", align: "left" },
        
    ];
}

export const getConfigCustomersTable = (days, isInactive = false) => ({
    tableId: 'tabela-clientes',
    cols: getColsCustomers(days, isInactive),
    dataKeys: ['CODPARC'],
    expandable: true,
});

export function renderCustomersTable(dados, days = "60", isInactive = false) {
    const config = getConfigCustomersTable(days, isInactive);
    return `
        <div class="table-container" id="container-tabela-clientes">
            <div class="info-header">
                <div class="header-buttons">
                    <button class="btn-refresh" title="Atualizar"><i class="bi bi-arrow-clockwise"></i></button>
                    <button class="btn-export" title="Exportar"><i class="bi bi-download"></i></button>
                </div>
                
                <div class="pagination-container" id="pagination-${config.tableId || 'generico'}"></div>
            </div>
            ${criarTabela(dados, config)}
        </div>
    `;
}