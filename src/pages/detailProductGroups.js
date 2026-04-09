import { fmtBRL } from "../util/data-format-utils.js";
import { criarTabela } from "../components/table.js";

let days = "60";
export const COLS_GRUPOS = [
    { key: "DESCRGRUPOPROD", name: "Nome", align: "left" },
    { key: "TOTALVENDAS", name: "Código", fmt: fmtBRL, align: "center" },
];

export const CONFIG_GRUPOS ={
    tableId: 'tabela-grupos',
    cols: COLS_GRUPOS,
    dataKeys: ['CODPARC'],
    expandable: true,
};

export function renderGroupsTable(dados) {
    return `
        <div class="table-container" id="container-tabela-clientes">
            <div class="info-header">
                <div class="header-buttons">
                    <button class="btn-refresh"><i class="bi bi-arrow-clockwise"></i></button>
                    <button class="btn-export"><i class="bi bi-download"></i></button>
                </div>
                <span class="records-count">${dados.length} registros</span>
            </div>
            ${criarTabela(dados, CONFIG_GRUPOS)}
        </div>
    `
}