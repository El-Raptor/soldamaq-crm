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

  const campos = "NOMEPARC,  CODPARC, MAIORORC_30D, MAIORORC_60D, MAIORORC_90D, TOTALVENDAS_30D, TOTALVENDAS_60D, TOTALVENDAS_90D, ORCACUM_30D, ORCACUM_60D, ORCACUM_90D, VLRORCPEN, ULT_VENDA, ULT_ORC, TELEFONE, EMAIL, ULTVENDEDOR"
   

  const results = await JSK.consultarView("VGFCRM_SKMS", campos, null);

  if (!results || results.status == 0) {
    console.error("Erro ao obter clientes", results.statusMessage)
    throw new Error("Erro ao carregar o lote inicial.", results.statusMessage);
  }

  const rawRecords = results.responseBody.records.record

  const registrosLimpos = flatResults(rawRecords);

  return registrosLimpos;
}

export async function getInactiveCustomers() {
  if (isDev) {
    return []
  }

  const campos = "NOMEPARC,  CODPARC, MAIORORC, TOTALVENDAS, ORCACUM, VLRORCPEN, ULT_VENDA, ULT_ORC, TELEFONE, EMAIL, ULTVENDEDOR"
  
  const results = await JSK.consultarView("VGFCRM_SC_SKMS", campos, null);

  if (!results || results.status == 0) {
    throw new Error("Erro ao carregar o lote inicial.", results.statusMessage);
  }

  const rawRecords = results.responseBody.records.record;

  const registrosLimpos = flatResults(rawRecords);

  return registrosLimpos;
}

function flatResults(rawRecords) {
  const registrosLimpos = rawRecords.map(row => {
    const flatRow = {};
    
    for (const key in row) {
        let val = row[key];
        
        // Se o valor for um objeto (e não for nulo), precisamos "desempacotar"
        if (typeof val === 'object' && val !== null) {
            // Se for um objeto vazio {}, significa que a tag XML veio vazia (campo sem valor)
            if (Object.keys(val).length === 0) {
                val = null;
            } else {
                // Tenta buscar as chaves padrão de parsers XML-to-JSON ('$', '_', 'value')
                // Se não achar nenhuma dessas, pega a primeira propriedade que existir lá dentro
                val = val.$ || val._ || val.value || Object.values(val)[0]; 
            }
        }
        
        flatRow[key] = val;
    }
    
    return flatRow;
  });
  return registrosLimpos;
}