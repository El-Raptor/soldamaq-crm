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

export function renderEmptyTabContainer() {
  const tabsContainer = document.querySelector(".tabs-container");

  //if (tabsContainer) tabsContainer.remove();

  tabsContainer.innerHTML = `
    <div class="empty-state">
        <span>Selecione um cliente acima para visualizar os seus detalhes.</span>
    </div>
    `;
}

export function renderFinalConsumerState() {
  const tabsContainer = document.querySelector(".tabs-container");

  //if (tabsContainer) tabsContainer.remove();

  tabsContainer.innerHTML = `
    <div class="final-consumer-state">
        <span>Análise para Consumidor Final não disponível. Selecione outro cliente acima.</span>
    </div>
    `;
}
