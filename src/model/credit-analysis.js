import { ServicoDados as JSK } from "../service/ServicoDados.js";
import { isDev } from "../util/env.js";
import { fetchMock } from "../util/mock-fetcher.js";

export async function getCreditAnalysis(codparc) {
    if (isDev) {
      return await fetchMock("credit_analysis.json");
    }

    const query = `
      SELECT
            FIN.NUFIN
          , FIN.DTVENC
          , FIN.DHBAIXA
          , COALESCE(TRUNC(DHBAIXA), TRUNC(SYSDATE)) - FIN.DTVENC AS DIASATRASO
          , TIT.DESCRTIPTIT
          , FIN.NUMNOTA
          , FIN.NUNOTA
          , VEN.APELIDO
      FROM 
          TGFFIN FIN
          JOIN TGFTIT TIT ON FIN.CODTIPTIT = TIT.CODTIPTIT
          JOIN TGFVEN VEN ON FIN.CODVEND = VEN.CODVEND
      WHERE
            FIN.PROVISAO = 'N'
        AND FIN.CODPARC = ?
    ORDER BY
        FIN.DTVENC DESC
    `;

    const params = [{ value: codparc, type: "I" }]

    const results = await JSK.consultar(query, params);

    if (results.status == 0) {
      console.error("Erro ao obter análise de crédito:", results.statusMessage);
      throw new Error("Erro ao obter análise de crédito:", results.statusMessage);
    }

    return results;

}