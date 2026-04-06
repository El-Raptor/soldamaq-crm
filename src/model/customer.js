import { ServicoDados as JSK } from "../service/ServicoDados.js";
import { isDev } from "../util/env.js";
import { fetchMock } from "../util/mock-fetcher.js";

let clientesCache = [];
let carregandoEmBackground = false;

export async function getCountCustomers() {
  if (isDev) return clientesCache.length;

  const query = `
    SELECT COUNT(*) AS QTD
    FROM VGFCRM_SKMS
  `
  const results = await JSK.consultar(query, null);
  
  if (!results || results.status == 0) {
    console.error("Erro ao buscar total de clientes", error);
    throw new Error("Erro ao buscar total de clientes.");
  }

  return parseInt(results[0].QTD, 10);
}

export async function getCustomers() {
  if (isDev) {
    const results = await fetchMock("customers.json")
    clientesCache = results;

    return results
  }

  // Paginação padrão para Oracle 11 usando ROWNUM
  // Dica: Ajuste o "ORDER BY CODPARC" para a coluna que faz sentido no seu CRM
  const query = `
      SELECT *
      FROM VGFCRM_SKMS
      ORDER BY CODPARC
  `;
  
  const results = await JSK.consultarDB(query, null);

  if (!results || results.status == 0) {
    throw new Error("Erro ao carregar o lote inicial.", results.statusMessage);
  }

  return results.resultado;
}
