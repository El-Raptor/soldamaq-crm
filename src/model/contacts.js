import { ServicoDados as JSK } from "../service/ServicoDados.js";
import { isDev } from "../util/env.js";
import { fetchMock } from "../util/mock-fetcher.js";

export async function getContacts(codparc) {
    if (isDev) return await fetchMock("contacts.json");

    const query = `
      SELECT 
            PAR.CODPARC
          , PAR.NOMEPARC AS NOME
          , '' AS TIPO
          , PAR.TELEFONE
          , PAR.FAX AS CELULAR
          , PAR.EMAIL
          , (SELECT MAX(DHCHAMADA) FROM TGFTEL WHERE CODPARC = PAR.CODPARC) AS ULTCHAMADA
      FROM 
          TGFPAR PAR
      WHERE 
          PAR.CODPARC = ?

      UNION ALL

      SELECT
          CTT.CODPARC
          , CTT.NOMECONTATO AS NOME
          , '' AS TIPO
          , CTT.TELEFONE
          , CTT.CELULAR
          , CTT.EMAIL
          , (SELECT MAX(DHCHAMADA) FROM TGFTEL WHERE CODPARC = CTT.CODPARC AND CODCONTATO = CTT.CODCONTATO ) AS ULTCHAMADA
      FROM
          TGFCTT CTT
      WHERE
          CTT.CODPARC = ?
    `;

    const params = [
      { value: codparc, type: "I" },
      { value: codparc, type: "I" }
    ];

    const results = await JSK.consultar(query, params);

    if (!results || results.status == 0) {
      throw new Error("Erro ao obter contatos: ", results.statusMessage);
    }

    return results;

}