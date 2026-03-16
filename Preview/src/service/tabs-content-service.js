import { renderTabsContainer } from "../components/tabs-container.js";
import { renderTabContent } from "../pages/tabsContent.js";


const historico = [
    { key: "DESCRGRUPO", label: "Grupo", align: "left" },
    { key: "DESCRPROD", label: "Produto", align: "left" },
    { key: "CODPROD", label: "Código", align: "left" },
    { key: "MARCA", label: "Marca", align: "left" },
    { key: "ULTPRECO", label: "Últ. Preço", align: "right" },
    { key: "ULTQTD", label: "Últ. Qtd.", align: "right" },
    { key: "ULTVENDA", label: "Últ. Venda", align: "right" },
    { key: "ULTVENDEDOR", label: "Últ. Vendedor", align: "right" },
    { key: "RAZAOSOCIAL", label: "Empresa", align: "left" },
    { key: "ULTPED", label: "Últ. Pedido", align: "right" },
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

export function initTabsListener(codparc, dados) {
    const cols = { historico, credito, contatos, produtos };

    renderTabsContainer();
    
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
}

function changeTab(dados, cols, tabId) {
    const tab = document.getElementById(tabId);
    const panes = document.querySelectorAll(".tab-pane");
    if (panes) panes.forEach(pane => pane.classList.remove('active'));
    
    renderTabContent(dados, cols, tab.id)
}