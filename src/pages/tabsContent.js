import { criarTabela } from "../components/table.js";
import { initTable } from "../service/table-service.js"; // NOVO IMPORT

export function renderTabContent(dados, configs, tabId) {
    const tabsContainer = document.querySelector(".tabs-container");
    let tabContent = document.querySelector(".tab-content");
    
    if (!tabContent) {
        tabsContainer.insertAdjacentHTML("beforeend", `<div class="tab-content"></div>`);
        tabContent = document.querySelector(".tab-content");
    }

    tabContent.innerHTML = ""; 
    renderPane(dados, configs, tabId);
}

function renderPane(dados, configs, tabId) {
    const tabContent = document.querySelector(".tab-content");
    
    const abaConfig = configs[tabId];
    const abaDados = dados[tabId];

    const html = `
        <div id="tab-${tabId}" class="tab-pane active">
            <div class="table-container" id="container-${abaConfig.tableId || tabId}">
                ${renderTable(abaDados, abaConfig)}
            </div>
        </div>
    `;

    tabContent.insertAdjacentHTML("beforeend", html);

    // NOVO: Inicializa a lógica da tabela para esta aba específica
    initTable(abaDados, abaConfig, null);
}

function renderTable(dados, configs) {
    return criarTabela(dados, configs);
}