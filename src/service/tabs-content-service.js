import { renderEmptyTabContainer, renderTabsContainer, renderFinalConsumerState } from "../components/tabs-container.js";
import { renderTabContent } from "../pages/tabsContent.js";
import { fmtBRL, fmtDate, fmtDhBaixa, fmtDiasAtraso } from "../util/data-format-utils.js";

let configs = []

export function initTabsListener(codparc, dados) {
    renderTabsContainer();
    if (codparc && codparc != 1) {
        initConfigs()
        const tabs = document.querySelectorAll(".tabs-header .pill-button");
        tabs.forEach(tab => {
            tab.addEventListener("click", (e) => {
                const pills = document.querySelectorAll(".tabs-header .pill-button");
                pills.forEach(pill => pill.classList.remove("active"));
                
                tab.classList.add("active"); 
                changeTab(dados, configs, tab.id);
                e.stopPropagation();
            });
        });
    
        // Renderiza a aba de histórico por padrão ao carregar a seção
        changeTab(dados, configs, "historico");
        return
    }

    if (codparc == 1) {
        initFinalConsumerState();
        return;
    }
    initEmptyTab()
    
}

function initEmptyTab() {
    renderEmptyTabContainer();
}

function initFinalConsumerState() {
    renderFinalConsumerState();
}

function changeTab(dados, cols, tabId) {
    const tab = document.getElementById(tabId);
    const panes = document.querySelectorAll(".tab-pane");
    if (panes) panes.forEach(pane => pane.classList.remove('active'));
    
    renderTabContent(dados, cols, tab.id)
}

function initConfigs() {
    const historico = {
        tableId: 'tabela-historico',
        cols: COLS_HISTORICO,
    }
    const credito = {
        tableId: 'tabela-credito',
        cols: COLS_CREDITO,
    }
    const contatos = {
        tableId: 'tabela-contatos',
        cols: COLS_CONTATOS,
    }
    const produtos = {
        tableId: 'tabela-produtos',
        cols: COLS_PRODUTOS,
    }
    configs = { historico, credito, contatos, produtos };
}

const COLS_HISTORICO = [
    { key: "DESCRGRUPOPROD", name: "Grupo", align: "left" },
    { key: "DESCRPROD", name: "Produto", align: "left" },
    { key: "CODPROD", name: "Código", align: "left" },
    { key: "MARCA", name: "Marca", align: "left" },
    { key: "ULTVLR", name: "Últ. Preço", fmt: fmtBRL, align: "right" },
    { key: "ULTQTD", name: "Últ. Qtd.", fmt: fmtBRL, align: "right" },
    { key: "ULTVEND", name: "Últ. Venda", fmt: fmtDate, align: "center" },
    { key: "ULTVENDEDOR", name: "Últ. Vendedor", align: "center" },
    { key: "RAZAOSOCIAL", name: "Empresa", fmt: fmtBRL, align: "left" },
    { key: "ULTPED", name: "Últ. Pedido", fmt: fmtDate, align: "center" },
];
const COLS_CREDITO = [
    { key: "NUFIN", name: "Nº Financeiro", align: "center" },
    { key: "DTVENC", name: "Vencimento", fmt: fmtDate, align: "center" },
    { key: "DHBAIXA", name: "Data Pagamento", fmt: fmtDhBaixa, align: "center" },
    { key: "DIASATRASO", name: "Dias Atraso", fmt: fmtDiasAtraso, align: "center" },
    { key: "DESCRTIPTIT", name: "Tipo Título", align: "left" },
    { key: "NUMNOTA", name: "Nº Nota", align: "center" },
    { key: "NUNOTA", name: "Nº Único", align: "center" },
    { key: "APELIDO", name: "Vendedor", align: "left" },
];

const COLS_CONTATOS = [
    { key: "NOME", name: "Nome", align: "left" },
    { key: "TIPO", name: "Tipo", align: "left" },
    { key: "TELEFONE", name: "Telefone", align: "left" },
    { key: "CELULAR", name: "Celular", align: "left" },
    { key: "EMAIL", name: "E-mail", align: "left" },
    { key: "ULTCHAMADA", name: "Último Contato", fmt: fmtDate, align: "center" },
];

const COLS_PRODUTOS = [
    { key: "CODPROD", name: "Código", align: "center" },
]