import { renderTableContainer } from "../components/customer-table.js";
import { setActiveCodparc } from "../main.js";
import { getCountCustomers, getCustomers } from "../model/customer.js";
import { initButtonsListener } from "./action-buttons-service.js";
import { initPaginationControls } from "./pagination-controls-service.js";

let cols = [];
let days = "60";
let loadedData = null;

export async function initTable() {
  const dados = await getCustomers();
  const qtdRegistros = await getCountCustomers();

  loadedData = dados;

  loadTable(days);
}

export function loadTable(newDay) {
  days = newDay;
  initCols();
  renderTableContainer(loadedData, cols);
  initPaginationControls(loadedData.length);
  selectCustomerListener();
  initButtonsListener()
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
