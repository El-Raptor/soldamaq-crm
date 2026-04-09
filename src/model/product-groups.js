import { ServicoDados as JSK } from "../service/ServicoDados.js";
import { isDev } from "../util/env.js";

export async function getProductGroups(codparc) {
    if (isDev) return [];

    const query = `
        SELECT
              GRU.DESCRGRUPOPROD
            , GCR.PRIORIDADE
            , SUM(ITE.VLRTOT) AS TOTALVENDAS
        FROM 
            TGFCAB CAB
            JOIN TGFITE ITE ON CAB.NUNOTA = ITE.NUNOTA
            JOIN TGFPRO PRO ON ITE.CODPROD = PRO.CODPROD
            JOIN TGFGRU GRU ON PRO.CODGRUPOPROD = GRU.CODGRUPOPROD
            JOIN AD_TGFGRUCRM GCR ON GRU.CODGRUPOPROD = GCR.CODGRUPOPROD
        WHERE 
            CAB.STATUSNOTA = 'L'
            AND CAB.DTNEG >= SYSDATE - 90 -- Mantém o filtro na CTE para o maior período
            AND CAB.CODTIPOPER IN (SELECT CODTIPOPER FROM AD_CENTRALPARAMTOP WHERE NUPAR IN (2))
            AND CAB.CODPARC = ?
        GROUP BY 
            GRU.DESCRGRUPOPROD, GCR.PRIORIDADE
        ORDER BY GCR.PRIORIDADE
    `;

    const params = [{ value: codparc, type: "I" }];
    const results = await JSK.consultar(query, params)

    if (results.status == 0) {
        throw new Error("Erro ao obter dados de Clientes por Grupos de Produtos:", results.statusMessage);
    }

    return results
}