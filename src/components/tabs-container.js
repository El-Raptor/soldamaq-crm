
export function renderTabsContainer() {
    const secaoInferior = document.querySelector(".secao-inferior");
    const tabsExistente = document.querySelector(".tabs-container");

    if (tabsExistente) tabsExistente.remove();
    secaoInferior.insertAdjacentHTML("beforeend", tabsHtml());
}

function tabsHtml() {
    return `
        <div class="tabs-container">
            <div class="tabs-header">
                <button class="pill-button active" id="historico">Histórico de Vendas</button>
                <button class="pill-button" id="credito">Análise de Crédito</button>
                <button class="pill-button" id="contatos">Contatos</button>
                <button class="pill-button" id="produtos">Produtos Sugeridos</button>
            </div>
        </div>
    `;
}

