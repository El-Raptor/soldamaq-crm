import { setActiveCodparc } from "../main.js";
import {
  getCountCustomers,
  getCustomers,
  carregarLoteInicial,
  iniciarBuscaBackground,
  getAllCustomers,
  isBackgroundLoading,
} from "../model/customer.js";
import { initButtonsListener } from "./action-buttons-service.js";
import {
  getOffset,
  initPaginationControls,
  tamanhoPagina,
} from "./pagination-controls-service.js";
import { renderTableContainer, initSortListeners, initFilterListeners } from "../components/customer-table.js";
import { openFilterModal } from "../components/column-filter-modal.js";
import { exportToExcel } from "../util/export.js";
import { fmtBRL, fmtDate } from "../util/data-format-utils.js";
import { sortData } from "../util/sort-utils.js";
import { getUniqueValues, applyFilters } from "../util/filter-utils.js";

let cols = [];
let days = "60";
let loadedData = null;
let originalPageData = null;
let totalRegistros = null;
let toastElement = null;

let sortState = { col: null, dir: null };
let filterState = {};

export async function initTable() {
  totalRegistros = await getCountCustomers();
  showToast(`Iniciando carregamento de ${totalRegistros} clientes...`);
  await carregarLoteInicial();

  iniciarBuscaBackground(
    totalRegistros,
    (atual, total) =>
      updateToast(
        `Carregando em segundo plano: ${atual} de ${total} clientes...`,
      ),
    () => updateToast("Todos os registros foram carregados com sucesso!", true),
  );

  const offset = getOffset();
  loadedData = await getCustomers(offset, tamanhoPagina);

  // Salva uma cópia exata dos dados originais para restaurar depois
  originalPageData = [...loadedData];
  sortState = { col: null, dir: null }; // Reseta a ordenação ao carregar nova página

  initButtonsListener();
  loadTable(days, totalRegistros);
}

export function loadTable(newDay, totalRegistros) {
  days = newDay;
  initCols();
  renderTableContainer(loadedData, cols, sortState, filterState);
  initPaginationControls(totalRegistros);
  
  selectCustomerListener();
  initSortListeners(handleSort);
  initFilterListeners(handleFilterClick);
}

export async function updateTable() {
  const offset = getOffset();

  const dados = await getCustomers(offset, tamanhoPagina, () => {
    updateToast("Aguarde, finalizando o download desta página...");
  });

  loadedData = dados;
  // Atualiza os dados originais quando mudar de página
  originalPageData = [...dados];
  sortState = { col: null, dir: null };

  loadTable(days, totalRegistros);
}

function applyViewTransformations() {
  let dataToRender = [...originalPageData];

  // 1. Aplica Filtros
  dataToRender = applyFilters(dataToRender, cols, filterState);

  // 2. Aplica Ordenação
  dataToRender = sortData(dataToRender, sortState.col, sortState.dir);

  // 3. Atualiza UI
  loadedData = dataToRender;
  renderTableContainer(loadedData, cols, sortState, filterState);
  
  selectCustomerListener();
  initSortListeners(handleSort);
  initFilterListeners(handleFilterClick);
}

function handleSort(key) {
  if (sortState.col === key) {
    if (sortState.dir === 'asc') sortState.dir = 'desc';
    else if (sortState.dir === 'desc') { sortState.dir = null; sortState.col = null; }
  } else {
    sortState.col = key;
    sortState.dir = 'asc';
  }
  applyViewTransformations();
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

function handleFilterClick(key, anchorElement) {
  const column = cols.find(c => c.key === key);
  
  // Extrai valores únicos dos dados originais da página, não dos dados já filtrados
  const uniqueValues = getUniqueValues(originalPageData, column);
  const activeValues = filterState[key]; // Pega o que já está filtrado, se houver

  openFilterModal(column, uniqueValues, activeValues, anchorElement, (colKey, selectedValues) => {
    if (selectedValues === null) {
      delete filterState[colKey]; // Remove filtro se tudo foi selecionado
    } else {
      filterState[colKey] = selectedValues;
    }
    applyViewTransformations();
  });
}

export function handleExport() {
  const allData = getAllCustomers();

  if (isBackgroundLoading()) {
    const confirmar = confirm(
      `Atenção: O sistema ainda está baixando os clientes em segundo plano. Até agora foram carregados ${allData.length} registros.\n\nDeseja exportar apenas os dados já carregados?`,
    );
    if (!confirmar) {
      return;
    }
  }

  exportToExcel(allData, cols, "Exportacao_Clientes_Completa");
}

function initCols() {
  cols = [
    { key: "NOMEPARC", label: "Nome", align: "left" },
    { key: "CODPARC", label: "Código", align: "center" },
    {
      key: `MAIORORC_${days}D`,
      label: `Maior Orçamento ${days} Dias`,
      fmt: fmtBRL,
      align: "right",
    },
    {
      key: `TOTALVENDAS_${days}D`,
      label: `Total de Vendas ${days} Dias`,
      fmt: fmtBRL,
      align: "right",
    },
    {
      key: `MAIORORC_${days}D`,
      label: `Maior Orçamento ${days} Dias`,
      fmt: fmtBRL,
      align: "right",
    },
    {
      key: `ORCACUM_${days}D`,
      label: "Orçamento Acumulado",
      fmt: fmtBRL,
      align: "right",
    },
    {
      key: "VLRORCPEN",
      label: "Orçamento Pendente",
      fmt: fmtBRL,
      align: "right",
    },
    { key: "ULT_VENDA", label: "Última Venda", fmt: fmtDate, align: "center" },
    {
      key: "ULT_ORC",
      label: "Último Orçamento",
      fmt: fmtDate,
      align: "center",
    },
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
