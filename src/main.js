// Importação de Serviços (Controladores)
import { initFilters } from "./service/filters-service.js";
import { initTabsListener } from "./service/tabs-content-service.js";
import { initTable } from "./service/table-service.js";
import { showLoading, hideLoading } from "./service/loading-service.js";

import { ajustarLayout } from "./util/ajustar-layout.js";

// Importação de Componentes
import { getConfigCustomersTable, renderCustomersTable } from "./components/superior-section.js";
import { renderDataFilter, renderPillsContainer } from "./components/filter-btns.js";
import { renderGroupsTable, CONFIG_GRUPOS } from "./pages/detailProductGroups.js";

// Importação de Consultas
import { getHistoricalSales } from "./model/historical-sales.js";
import { getCreditAnalysis } from "./model/credit-analysis.js";
import { getContacts } from "./model/contacts.js";
import { getProducts } from "./model/products.js";
import { getCustomers, getInactiveCustomers } from "./model/customer.js";
import { getProductGroups } from "./model/product-groups.js";

const mainContainer = document.querySelector("main")
const secaoSuperior = document.querySelector(".secao-superior");
const secaoInferior = document.querySelector(".secao-inferior");

let activeCodparc = null;
let clientesGlobais = [];
let currentFilter = "maiores-clientes"; // Guarda a aba principal ativa
let currentDays = "60";

const cacheCategorias = {
    "maiores-clientes": null,
    "nao-compraram": null,
    "orcamento-pendente": null
};

//ajustarLayout();

document.addEventListener("DOMContentLoaded", async () => {
  
  await carregarSecaoSuperior()
  initTabsListener(activeCodparc, null)
});

async function carregarSecaoSuperior() {
  showLoading("Carregando clientes iniciais...");
  
  try {
    const dados = await getCustomers();
    cacheCategorias["maiores-clientes"] = dados;
    clientesGlobais = dados;

    const html = `
        ${renderDataFilter()}
        ${renderPillsContainer()}
        ${renderCustomersTable(clientesGlobais, "60")}
      `;
    secaoSuperior.innerHTML = html;
    initTable(clientesGlobais, getConfigCustomersTable("60"), setActiveCodparc);
    initFilters();

  } catch (error) {
    console.error(error);
  } finally {
    hideLoading()
  }
}

secaoSuperior.addEventListener("click", (e) => {
    const btnGrupos = e.target.closest(".row-action-btn");
    
    if (btnGrupos) {
        e.stopPropagation(); // Impede que o clique expanda a linha ou ative a parte inferior
        const codparc = btnGrupos.dataset.codparc;
        abrirDetalheGrupos(codparc);
    }
});

async function abrirDetalheGrupos(codparc) {
    const containerTabela = document.getElementById("container-tabela-clientes");
    if (!containerTabela) return;

    // Feedback visual do carregamento
    showLoading("Gerando análise de clients por grupos...");

    try {
        const grupos = await getProductGroups(codparc);
        
        // Renderiza a nova tabela e adiciona um botão para Voltar
        const html = `
            <div style="margin-bottom: 15px;">
                <button class="pill-button" id="btn-voltar-clientes">
                    <i class="bi bi-arrow-left"></i> Voltar para Clientes
                </button>
            </div>
            ${renderGroupsTable(grupos)}
        `;
        
        containerTabela.outerHTML = `<div id="container-tabela-clientes">${html}</div>`;

        // Inicializa a tabela de grupos (para filtros/ordenação funcionarem)
        initTable(grupos, CONFIG_GRUPOS, null);

        // Evento para voltar à visão principal
        document.getElementById("btn-voltar-clientes").addEventListener("click", () => {
            atualizarTabelaPorTempo(currentDays); 
        });

    } catch (err) {
        console.error("Erro ao abrir detalhe de grupos:", err);
        containerTabela.innerHTML = "<p style='color: red;'>Erro ao carregar os grupos. Tente novamente.</p>";
    } finally {
        hideLoading()
    }
}

export function atualizarTabelaPorTempo(days) {
    currentDays = days;
    const containerTabela = document.getElementById("container-tabela-clientes");
    if (!containerTabela) return;
    
    const isInactive = (currentFilter === "nao-compraram");
    
    containerTabela.outerHTML = renderCustomersTable(clientesGlobais, currentDays, isInactive);
    initTable(clientesGlobais, getConfigCustomersTable(currentDays, isInactive), setActiveCodparc);
}

export async function atualizarTabelaPorCategoria(categoria) {
    const containerTabela = document.getElementById("container-tabela-clientes");
    if (!containerTabela) return;

    currentFilter = categoria;
    const isInactive = (categoria === "nao-compraram");

    // LÓGICA DO CACHE: Verifica se já temos os dados
    if (cacheCategorias[categoria]) {
        // Pega do cache instantaneamente
        clientesGlobais = cacheCategorias[categoria];
    } else {
        // Se não tem no cache, avisa o usuário e vai buscar no banco
        showLoading("Buscando nova categoria...");

        try {
            if (isInactive) {
                cacheCategorias[categoria] = await getInactiveCustomers();
            } else {
                // (Se tiver lógica específica pro orcamento-pendente no futuro, mude aqui)
                cacheCategorias[categoria] = await getCustomers(); 
            }
            
            // Atualiza a global com o novo dado guardado
            clientesGlobais = cacheCategorias[categoria];
            
        } catch (error) {
            console.error("Erro ao buscar nova categoria:", error);
            hideLoading()
            return; // Aborta a troca de tabela em caso de erro
        } finally {
            hideLoading()
        }
    }

    // Renderiza e inicializa instantaneamente
    containerTabela.outerHTML = renderCustomersTable(clientesGlobais, currentDays, isInactive);
    initTable(clientesGlobais, getConfigCustomersTable(currentDays, isInactive), setActiveCodparc);
    
    // Limpa o cliente ativo (parte inferior)
    setActiveCodparc(null);
}

export async function setActiveCodparc(codparc) {
  activeCodparc = codparc;
  if (codparc == 1 || !codparc) {
    initTabsListener(activeCodparc, null);
    return;
  }

  showLoading("Gerando análise completa do cliente...");

  try {
      const historico = await getHistoricalSales(activeCodparc);
      const credito = await getCreditAnalysis(activeCodparc);
      const contatos = await getContacts(activeCodparc);
      const produtos = await getProducts(activeCodparc);
      const dados = { historico, credito, contatos, produtos };
      initTabsListener(activeCodparc, dados);
  } catch (error) {
    console.error("Erro ao gerar análise completa.", error);
  } finally {
    hideLoading()
  }
}