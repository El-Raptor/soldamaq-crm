
export function renderTableContainer(dados, cols, sortState = { col: null, dir: null }) {
  const secaoSuperior = document.querySelector(".secao-superior");

  const tabelaExistente = document.querySelector(".table-container");
  const paginacaoExistente = document.querySelector(".pagination-container");

  if (tabelaExistente) tabelaExistente.remove();
  if (paginacaoExistente) paginacaoExistente.remove();

  secaoSuperior.insertAdjacentHTML("beforeend", renderTable(dados, cols, sortState));
}

function renderTable(dados, cols, sortState) {
  return `
      <div class="table-container">
        <table class="tabela-principal">
            <thead>
                ${cols
                  .map((col) => {
                    // Lógica para definir o ícone de ordenação
                    const isSorted = sortState.col === col.key;
                    let sortIcon = "bi-chevron-expand"; // Neutro
                    if (isSorted) {
                      sortIcon = sortState.dir === 'asc' ? "bi-chevron-compact-up" : "bi-chevron-compact-down";
                    }

                    return `
                    <th class="align-${col.align} sortable" data-key="${col.key}">
                        <div class="th-content">
                            <span class="th-text">${col.label}</span>
                            <i class="bi ${sortIcon} sort-indicator"></i>
                        </div>
                    </th>
                    `;
                  })
                  .join("")}
            </thead>
            <tbody>
                ${dados
                  .map(
                    (row) => `
                    <tr data-codparc=${row.CODPARC}>
                        ${cols.map((col) => `<td class="align-${col.align}">${renderCell(col, row)}</td>`).join("")}
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

const renderCell = (col, row) => {
  const val = col.fmt ? col.fmt(row[col.key]) : row[col.key];
  return val ?? "";
}

export function initSortListeners(onSortCallback) {
  const headers = document.querySelectorAll(".tabela-principal th.sortable");
  
  headers.forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.key;
      if (key) {
        onSortCallback(key);
      }
    });
  });
}