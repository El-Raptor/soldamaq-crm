export function renderTableContainer(dados, cols) {
  const secaoSuperior = document.querySelector(".secao-superior");

  const tabelaExistente = document.querySelector(".table-container");
  const paginacaoExistente = document.querySelector(".pagination-container");

  if (tabelaExistente) tabelaExistente.remove();
  if (paginacaoExistente) paginacaoExistente.remove();

  secaoSuperior.insertAdjacentHTML("beforeend", renderTable(dados, cols));
}

function renderTable(dados, cols) {
  return `
      <div class="table-container">
        <table class="tabela-principal">
            <thead>
                ${cols
                  .map(
                    (col) => `
                    <th class="${col.align}">${col.label}</th>
                `,
                  )
                  .join("")}
            </thead>
            <tbody>
                ${dados
                  .map(
                    (row) => `
                    <tr data-codparc=${row.CODPARC}>
                        ${cols.map((col) => `<td>${row[col.key]}</td>`).join("")}
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
      </div>
      <div class="pagination-container">
      </div>
    `;
}
