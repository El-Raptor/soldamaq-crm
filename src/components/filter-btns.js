export function renderDataFilter() {
  return `
        <div class="filter-container">
            <div class="filter-pills">
                <button class="pill-button data-filter active" id="maiores-clientes">
                    Maiores Clientes por Faturamento
                </button>
                <button class="pill-button data-filter" id="nao-compraram">
                    Sem Compras nos Últimos 15 Meses
                </button>
                <button class="pill-button data-filter" id="orcamento-pendente">
                    Clientes com Maior Orçamento Pendente
                </button>
            </div>
        </div>
    `
}

export function renderPillsContainer() {
  return `
        <div class="table-filter-container">
            ${pillsHtml()}
        </div>
    `
}

function pillsHtml() {
    return `
        <div class="time-filter-container">
            <div class="filter-pills">
                <button class="time-pill-button time-filter" id="30" >
                    Últimos 30 Dias
                </button>
                <button class="time-pill-button time-filter active" id="60">
                    Últimos 60 Dias
                </button>
                <button class="time-pill-button time-filter" id="90">
                    Últimos 90 Dias
                </button>
            </div>
        </div>
    `
}
