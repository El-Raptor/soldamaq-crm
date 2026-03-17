
export function renderTableContainer(dados, cols, sortState = { col: null, dir: null }, filterState = {}) {
  const secaoSuperior = document.querySelector(".secao-superior");

  const tabelaExistente = document.querySelector(".table-container");
  const paginacaoExistente = document.querySelector(".pagination-container");

  if (tabelaExistente) tabelaExistente.remove();
  if (paginacaoExistente) paginacaoExistente.remove();

  secaoSuperior.insertAdjacentHTML("beforeend", renderTable(dados, cols, sortState, filterState));
}

function renderTable(dados, cols, sortState, filterState) {
  return `
      <div class="table-container">
        <table class="tabela-principal">
            <thead>
                ${cols
                  .map((col) => {
                    // Lógica Sort
                    const isSorted = sortState.col === col.key;
                    let sortIcon = "bi-chevron-expand"; 
                    if (isSorted) sortIcon = sortState.dir === 'asc' ? "bi-chevron-compact-up" : "bi-chevron-compact-down";
                    
                    // Lógica Filter
                    const isFiltered = filterState[col.key] && filterState[col.key].length > 0;
                    const filteredClass = isFiltered ? "is-filtered" : ""; // Classe que mantém a gaveta aberta
                    const filterIcon = isFiltered ? "bi-funnel-fill" : "bi-funnel";

                    return `
                    <th class="align-${col.align} sortable ${filteredClass}" data-key="${col.key}">
                        <div class="th-content">
                            <span class="th-text">${col.label}</span>
                            <div class="th-icons">
                                <i class="bi ${sortIcon} sort-indicator"></i>
                            </div>
                        </div>
                        <div class="filter-drawer" data-key="${col.key}" title="Filtrar coluna">
                            <i class="bi ${filterIcon}"></i>
                        </div>
                    </th>
                    `;
                  })
                  .join("")}
            </thead>
            <tbody>
                ${dados
                  .map((row) => `
                    <tr data-codparc=${row.CODPARC}>
                        ${cols.map((col) => `<td class="align-${col.align}">${renderCell(col, row)}</td>`).join("")}
                    </tr>
                `).join("")}
            </tbody>
        </table>
      </div>
      <div class="pagination-container"></div>
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

export function initFilterListeners(onFilterClickCallback) {
  const filterDrawers = document.querySelectorAll(".filter-drawer");
  filterDrawers.forEach((drawer) => {
    drawer.addEventListener("click", (e) => {
      e.stopPropagation(); // Muito importante: Impede que o clique no funil ative a ordenação da coluna!
      const key = drawer.dataset.key;
      if (key) onFilterClickCallback(key, drawer);
    });
  });
}