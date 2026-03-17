import { renderEmptyTabContainer, renderTabsContainer, renderFinalConsumerState } from "../components/tabs-container.js";
import { renderTabContent } from "../pages/tabsContent.js";
import { fmtBRL, fmtDate } from "../util/data-format-utils.js";

let cols = []

export function initTabsListener(codparc, dados) {
    renderTabsContainer();
    if (codparc && codparc != 1) {
        initCols()
        const tabs = document.querySelectorAll(".tabs-header .pill-button");
        tabs.forEach(tab => {
            tab.addEventListener("click", (e) => {
                const pills = document.querySelectorAll(".tabs-header .pill-button");
                pills.forEach(pill => pill.classList.remove("active"));
                
                tab.classList.add("active"); 
                changeTab(dados, cols, tab.id);
                e.stopPropagation();
            });
        });
    
        // Renderiza a aba de histórico por padrão ao carregar a seção
        changeTab(dados, cols, "historico");
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

function initCols() {
    const historico = [
        { key: "DESCRGRUPOPROD", label: "Grupo", align: "left" },
        { key: "DESCRPROD", label: "Produto", align: "left" },
        { key: "CODPROD", label: "Código", align: "left" },
        { key: "MARCA", label: "Marca", align: "left" },
        { key: "ULTVLR", label: "Últ. Preço", fmt: fmtBRL, align: "right" },
        { key: "ULTQTD", label: "Últ. Qtd.", fmt: fmtBRL, align: "right" },
        { key: "ULTVEND", label: "Últ. Venda", fmt: fmtDate, align: "center" },
        { key: "ULTVENDEDOR", label: "Últ. Vendedor", align: "center" },
        { key: "RAZAOSOCIAL", label: "Empresa", fmt: fmtBRL, align: "left" },
        { key: "ULTPED", label: "Últ. Pedido", fmt: fmtDate, align: "center" },
    ];
    const credito = [
        { key: "NUFIN", label: "Nº Financeiro", align: "center" },
        { key: "DTVENC", label: "Vencimento", align: "center" },
        { key: "DHBAIXA", label: "Data Pagamento", align: "center" },
        { key: "DIASTRASO", label: "Dias Atraso", align: "center" },
        { key: "DESCRTIPTIT", label: "Tipo Título", align: "left" },
        { key: "NUMNOTA", label: "Nº Nota", align: "center" },
        { key: "NUNOTA", label: "Nº Único", align: "center" },
        { key: "APELIDO", label: "Vendedor", align: "left" },
    ];
    const contatos = [
        { key: "NOME", label: "Nome", align: "left" },
        { key: "TIPO", label: "Tipo", align: "left" },
        { key: "TELEFONE", label: "Telefone", align: "left" },
        { key: "CELULAR", label: "Celular", align: "left" },
        { key: "EMAIL", label: "E-mail", align: "left" },
        { key: "ULTCHAMADA", label: "Último Contato", align: "center" },
    ]
    const produtos = [
        { key: "CODPROD", label: "Código", align: "center" },
    ]
    cols = { historico, credito, contatos, produtos };
}