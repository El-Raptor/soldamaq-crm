import { initTable } from "./service/customer-table-service.js";
import { initFilters } from "./service/filters-service.js";
import { initTabsListener } from "./service/tabs-content-service.js";
import { getHistoricalSales } from "./model/historical-sales.js";
import { getCreditAnalysis } from "./model/credit-analysis.js";
import { getContacts } from "./model/contacts.js";
import { getProducts } from "./model/products.js";

let activeCodparc = null;

document.addEventListener("DOMContentLoaded", async () => {
  initFilters();
  await initTable();
  initTabsListener(activeCodparc, null)
});


export async function setActiveCodparc(codparc) {
  activeCodparc = codparc;
  
  if (codparc != 1) {
    const historico = await getHistoricalSales(activeCodparc);
    const credito = await getCreditAnalysis(activeCodparc);
    const contatos = await getContacts(activeCodparc);
    const produtos = await getProducts(activeCodparc);
    const dados = { historico, credito, contatos, produtos };
    initTabsListener(activeCodparc, dados);
  }
  else {
    initTabsListener(activeCodparc, null)
  }
}