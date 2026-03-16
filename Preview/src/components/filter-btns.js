import { renderExportBtn } from "./export-btn.js";

export function renderDataFilter() {
  const secaoSuperior = document.querySelector(".secao-superior") 
  secaoSuperior.insertAdjacentHTML("beforeend", `
        <div class="filter-container">
            <div class="filter-pills">
                <button class="pill-button active" id="maiores-clientes">
                    Maiores Clientes por Faturamento
                </button>
                <button class="pill-button" id="nao-compraram">
                    Sem Compras nos Últimos 15 Meses
                </button>
                <button class="pill-button" id="orcamento-pendente">
                    Clientes com Maior Orçamento Pendente
                </button>
            </div>
        </div>
    `);
}

export function renderPillsContainer() {
  const secaoSuperior = document.querySelector(".secao-superior") 
  secaoSuperior.insertAdjacentHTML("beforeend", `
        <div class="table-filter-container">
            ${pillsHtml()}
            ${renderExportBtn()}
        </div>
    `
  );
}

function pillsHtml() {
    return `
        <div class="time-filter-container">
            <div class="filter-pills">
                <button class="time-pill-button" id="30" >
                    Últimos 30 Dias
                </button>
                <button class="time-pill-button active" id="60">
                    Últimos 60 Dias
                </button>
                <button class="time-pill-button" id="90">
                    Últimos 90 Dias
                </button>
            </div>
        </div>
    `
}
