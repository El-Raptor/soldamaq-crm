export function renderPagination(pagination) {
  const paginationContainer = document.querySelector(".pagination-container");
  paginationContainer.innerHTML = `
       
        <div class="pagination-info">
            Página ${pagination.paginaAtual} de ${pagination.totalPaginas} (${pagination.primeiroItemPagina} - ${pagination.ultimoItemPagina} de ${pagination.totalItensPagina}
            registros)
        </div>

        <div class="pagination-controls">
            <!-- Primeiro -->
            <button class="btn-first-page" ${pagination.paginaAtual <= 1 ? "disabled" : ""}>
                <i class="bi bi-chevron-double-left"></i>
            </button>

            <button class="btn-previous-page" ${pagination.paginaAtual <= 1 ? "disabled" : ""}>
                <i class="bi bi-chevron-left"></i>
            </button>

            <!-- Páginas numeradas -->
            <button class="active">
                ${pagination.paginaAtual}
            </button>

            <!-- Próximo -->
            <button class="btn-next-page" ${pagination.paginaAtual >= pagination.totalPaginas ? "disabled" : ""}>
                <i class="bi bi-chevron-right"></i>
            </button>

            <!-- Último -->
            <button class="btn-last-page" ${pagination.paginaAtual >= pagination.totalPaginas ? "disabled" : ""}>
                <i class="bi bi-chevron-double-right"></i>
            </button>
        </div>
       
    `;
}
