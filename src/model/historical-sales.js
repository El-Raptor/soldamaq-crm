import { JSK } from "https://cdn.jsdelivr.net/npm/@jtandrelevicius/utils-js-library@latest/index.js";

export async function getHistoricalSales(codparc) {
    const query = `
        WITH
        PARCEIRO AS (
            SELECT CODPARC
            FROM TGFPAR
            WHERE CODPARC = ?
        ),
        TOPS AS (
            SELECT CODTIPOPER, NUPAR
            FROM AD_CENTRALPARAMTOP
            WHERE NUPAR IN (2,4)
        ),
        ULTNOTAS AS (
            SELECT *
            FROM (
                SELECT
                    ITE.CODPROD
                    , CAB.DTNEG
                    , CAB.TIPMOV
                    , ITE.VLRUNIT
                    , ITE.QTDNEG
                    , CAB.CODVEND
                    , CAB.CODEMP
                    , ROW_NUMBER() OVER(PARTITION BY CODPROD, TIPMOV ORDER BY DTNEG) AS RN
                FROM
                    TGFCAB CAB
                    JOIN TGFITE ITE ON CAB.NUNOTA = ITE.NUNOTA
                    JOIN PARCEIRO PAR ON CAB.CODPARC = PAR.CODPARC
                    JOIN TOPS TPO ON CAB.CODTIPOPER = TPO.CODTIPOPER
                WHERE
                    CAB.STATUSNOTA = 'L'
            )
            WHERE RN = 1 -- Restringe a apenas as últimas datas
        )
        SELECT
            GRU.DESCRGRUPOPROD
            , PRO.DESCRPROD
            , PRO.CODPROD
            , PRO.MARCA
            , MAX(CASE WHEN ULT.TIPMOV = 'V' THEN ULT.VLRUNIT END) AS ULTVLR
            , MAX(CASE WHEN ULT.TIPMOV = 'V' THEN ULT.QTDNEG END) AS ULTQTD
            , MAX(CASE WHEN ULT.TIPMOV = 'V' THEN ULT.DTNEG END) AS ULTVEND
            , MAX(CASE WHEN ULT.TIPMOV = 'V' THEN VEN.APELIDO END) AS ULTVENDEDOR
            , MAX(CASE WHEN ULT.TIPMOV = 'V' THEN EMP.RAZAOSOCIAL END) AS ULTEMP
            , MAX(CASE WHEN CAB.TIPMOV = 'V' THEN ITE.QTDNEG ELSE 0 END) AS QTDVEN
            , MAX(CASE WHEN ULT.TIPMOV = 'P' THEN ULT.DTNEG END) AS ULTPED
            , COUNT(DISTINCT PRO.CODPROD) OVER() AS TOTAL_COUNT
        FROM
            TGFPRO PRO
            JOIN TGFITE ITE ON PRO.CODPROD = ITE.CODPROD
            JOIN TGFCAB CAB ON ITE.NUNOTA = CAB.NUNOTA
            JOIN TGFGRU GRU ON PRO.CODGRUPOPROD = GRU.CODGRUPOPROD
            JOIN PARCEIRO PAR ON CAB.CODPARC = PAR.CODPARC
            LEFT JOIN ULTNOTAS ULT ON PRO.CODPROD = ULT.CODPROD
            LEFT JOIN TSIEMP EMP ON ULT.CODEMP = EMP.CODEMP
            LEFT JOIN TGFVEN VEN ON ULT.CODVEND = VEN.CODVEND
        WHERE 
            CAB.STATUSNOTA = 'L'
        GROUP BY
            GRU.DESCRGRUPOPROD
            , PRO.DESCRPROD
            , PRO.CODPROD
            , PRO.MARCA
        ORDER BY
            PRO.CODPROD
    `;

    const params = [
        { value: codparc, type: "I" }
    ];

    const results = JSK.consultar(query, params);
    
    if (!results) {
        throw new Error("Erro ao realizar operação no banco de dados")
    } else if (results.status == 0) {
        throw new Error("Erro ao realizar consulta do histórico.", results.statusMessage)
    }

    return results;
}