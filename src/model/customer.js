let clientesCache = [];
let carregandoEmBackground = false;

export async function getCountCustomers() {
  const query = `
    SELECT COUNT(*) AS QTD
    FROM VGFCRM_SKMS
    WHERE TOTALVENDAS_60D > 0
  `
  const results = await JSK.consultar(query, null);
  
  if (!results || results.status == 0) {
    throw new Error("Erro ao buscar total de clientes.");
  }

  return parseInt(results[0].QTD, 10);
}

export async function carregarLoteInicial() {
  // Paginação padrão para Oracle 11 usando ROWNUM
  // Dica: Ajuste o "ORDER BY CODPARC" para a coluna que faz sentido no seu CRM
  const query = `
    SELECT * FROM (
      SELECT a.*, ROWNUM rnum FROM (
        SELECT *
        FROM VGFCRM_SKMS
        WHERE TOTALVENDAS_60D > 0
        ORDER BY CODPARC
      ) a
      WHERE ROWNUM <= 1000
    )
    WHERE rnum > 0
  `;
  
  const results = await JSK.consultar(query, null);

  if (!results || results.status == 0) {
    throw new Error("Erro ao carregar o lote inicial.");
  }

  clientesCache = results;
  return clientesCache;
}

export async function iniciarBuscaBackground(totalRegistros, onProgress, onComplete) {
  carregandoEmBackground = true;
  const limite = 1000;

  for (let offset = 1000; offset < totalRegistros; offset += limite) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Pausa para não travar a UI

    const maxRow = offset + limite;
    const minRow = offset;

    const query = `
      SELECT * FROM (
        SELECT a.*, ROWNUM rnum FROM (
          SELECT *
          FROM VGFCRM_SKMS
          WHERE TOTALVENDAS_60D > 0
          ORDER BY CODPARC
        ) a
        WHERE ROWNUM <= ${maxRow}
      )
      WHERE rnum > ${minRow}
    `;
    
    const results = await JSK.consultar(query, null);
    
    if (results && results.length > 0) {
      clientesCache = [...clientesCache, ...results];
    }

    if (onProgress) onProgress(clientesCache.length, totalRegistros);
  }

  carregandoEmBackground = false;
  if (onComplete) onComplete();
}

export async function getCustomers(offset, limit = 50, onWait) {
  if (offset + limit > clientesCache.length && carregandoEmBackground) {
    if (onWait) onWait(); 
    
    while (offset + limit > clientesCache.length && carregandoEmBackground) {
      await new Promise(resolve => setTimeout(resolve, 500)); 
    }
  }

  return clientesCache.slice(offset, offset + limit);
}