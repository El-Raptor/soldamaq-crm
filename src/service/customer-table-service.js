import { renderTableContainer } from "../components/customer-table.js";
import { setActiveCodparc } from "../main.js";
import { getCountCustomers, getCustomers, carregarLoteInicial, iniciarBuscaBackground } from "../model/customer.js";
import { initButtonsListener } from "./action-buttons-service.js";
import { getOffset, initPaginationControls, tamanhoPagina } from "./pagination-controls-service.js";

let cols = [];
let days = "60";
let loadedData = null;
let totalRegistros = null
let toastElement = null;

export async function initTable() {
  totalRegistros = await getCountCustomers();
  
  showToast(`Iniciando carregamento de ${totalRegistros} clientes...`);

  // 1. Carrega os 1000 primeiros para liberar a tela
  await carregarLoteInicial();

  // 2. Inicia o processo silencioso dos outros 21 mil registros
  iniciarBuscaBackground(
    totalRegistros,
    (atual, total) => updateToast(`Carregando em segundo plano: ${atual} de ${total} clientes...`),
    () => updateToast("Todos os registros foram carregados com sucesso!", true)
  );

  // 3. Monta a tabela com a primeira página (50 itens)
  const offset = getOffset();
  loadedData = await getCustomers(offset, tamanhoPagina);

  loadTable(days, totalRegistros);
}

export function loadTable(newDay, totalRegistros) {
  days = newDay;
  initCols();
  renderTableContainer(loadedData, cols);
  initPaginationControls(totalRegistros);
  selectCustomerListener();
  initButtonsListener()
}

export async function updateTable() {
  const offset = getOffset();
  
  // Se a página clicada ainda não carregou no background, ele avisa pelo toast
  const dados = await getCustomers(offset, tamanhoPagina, () => {
    updateToast("Aguarde, finalizando o download desta página...");
  });
  
  loadedData = dados;
  loadTable(days, totalRegistros);
}

function selectCustomerListener() {
  const lines = document.querySelectorAll(".tabela-principal tbody tr");

  lines.forEach((line) => {
    line.addEventListener("click", async () => {
      const selectedLine = document.querySelector(
        ".tabela-principal tbody tr.selected",
      );
      selectedLine?.classList.remove("selected");

      line.classList.add("selected");
      await selectCustomer(line.dataset.codparc);
    });
  });
}

async function selectCustomer(codparc) {
  await setActiveCodparc(codparc);
}

function initCols() {
  cols = [
    { key: "NOMEPARC", label: "Nome", align: "left" },
    { key: "CODPARC", label: "Código", align: "center" },
    {
      key: `MAIORORC_${days}D`,
      label: `Maior Orçamento ${days} Dias`,
      align: "right",
    },
    {
      key: `TOTALVENDAS_${days}D`,
      label: `Total de Vendas ${days} Dias`,
      align: "right",
    },
    {
      key: `MAIORORC_${days}D`,
      label: `Maior Orçamento ${days} Dias`,
      align: "right",
    },
    { key: "ORCACUM", label: "Orçamento Acumulado", align: "right" },
    { key: "VLRORCPEN", label: "Orçamento Pendente", align: "right" },
    { key: "ULTVENDA", label: "Última Venda", align: "right" },
    { key: "ULTORC", label: "Último Orçamento", align: "right" },
    { key: "TELEFONE", label: "Telefone", align: "left" },
    { key: "EMAIL", label: "E-mail", align: "left" },
    { key: "ULTVENDEDOR", label: "Último Vendedor", align: "left" },
  ];
}

/* TOAST */
function showToast(message) {
  if (!toastElement) {
    toastElement = document.createElement("div");
    toastElement.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; 
      background: #2b2b2b; color: #fff; padding: 12px 20px;
      border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: sans-serif; font-size: 14px; z-index: 9999; 
      transition: opacity 0.5s ease;
    `;
    document.body.appendChild(toastElement);
  }
  toastElement.innerText = message;
  toastElement.style.opacity = "1";
}

function updateToast(message, autoClose = false) {
  if (toastElement) {
    toastElement.innerText = message;
    if (autoClose) {
      setTimeout(() => {
        toastElement.style.opacity = "0";
        setTimeout(() => {
          toastElement?.remove();
          toastElement = null;
        }, 500);
      }, 4000); // Exibe a mensagem de conclusão por 4 segundos e some
    }
  }
}