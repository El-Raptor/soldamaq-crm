export function openFilterModal(column, uniqueValues, activeFilters, anchorElement, onApply) {
  // Remove modal anterior se existir
  const existingModal = document.querySelector(".filter-modal-container");
  if (existingModal) existingModal.remove();

  // Se não houver filtros ativos prévios, todos começam marcados por padrão
  let selectedValues = activeFilters || [...uniqueValues];

  const modalHtml = `
    <div class="filter-modal-overlay"></div>
    <div class="filter-modal-container">
      <div class="filter-modal-header">
        <span>Filtrar: ${column.label}</span>
      </div>
      <div class="filter-modal-body">
        <input type="text" class="filter-search-input" placeholder="Pesquisar..." />
        <label class="filter-select-all-label">
          <input type="checkbox" class="filter-select-all" checked /> Selecionar Todos
        </label>
        <div class="filter-items-list">
          ${uniqueValues.map(val => `
            <label class="filter-item-label" style="display: flex;"> <input type="checkbox" class="filter-item-checkbox" value="${val}" 
                ${selectedValues.includes(val) ? "checked" : ""} /> 
              ${val || "<em>(Vazio)</em>"}
            </label>
          `).join("")}
        </div>
      <div class="filter-modal-footer">
        <button class="btn-cancel-filter">Cancelar</button>
        <button class="btn-apply-filter">Aplicar</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modalContainer = document.querySelector(".filter-modal-container");
  const overlay = document.querySelector(".filter-modal-overlay");
  const searchInput = modalContainer.querySelector(".filter-search-input");
  const selectAllCheckbox = modalContainer.querySelector(".filter-select-all");
  const itemCheckboxes = modalContainer.querySelectorAll(".filter-item-checkbox");
  const itemsList = modalContainer.querySelectorAll(".filter-item-label");

  // Posicionamento baseando-se no clique do cabeçalho
  const rect = anchorElement.getBoundingClientRect();
  modalContainer.style.top = `${rect.bottom + window.scrollY}px`;
  modalContainer.style.left = `${rect.left + window.scrollX}px`;

  // --- LÓGICA DE PESQUISA ---
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    let visibleCount = 0;
    let checkedVisibleCount = 0;

    itemsList.forEach((label) => {
      const checkbox = label.querySelector('input');
      const text = checkbox.value.toLowerCase();
      
      if (text.includes(term)) {
        label.style.display = "flex";
        visibleCount++;
        if (checkbox.checked) checkedVisibleCount++;
      } else {
        label.style.display = "none";
      }
    });

    // Atualiza o "Selecionar Todos" baseado apenas nos visíveis
    selectAllCheckbox.checked = visibleCount > 0 && visibleCount === checkedVisibleCount;
  });

  // --- LÓGICA DE SELECIONAR TODOS ---
  selectAllCheckbox.addEventListener("change", (e) => {
    const isChecked = e.target.checked;
    itemsList.forEach((label) => {
      if (label.style.display !== "none") {
        label.querySelector('input').checked = isChecked;
      }
    });
  });

  // --- LÓGICA DOS CHECKBOXES INDIVIDUAIS ---
  itemCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const visibleCheckboxes = Array.from(itemCheckboxes).filter(c => c.closest('label').style.display !== 'none');
      const allVisibleChecked = visibleCheckboxes.every(c => c.checked);
      selectAllCheckbox.checked = allVisibleChecked;
    });
  });

  // 👇 ADICIONE ESTA LINHA AQUI 👇
  // Força a pesquisa a rodar uma vez com o input vazio para garantir a exibição inicial
  searchInput.dispatchEvent(new Event("input"));

  // --- AÇÕES ---
  const closeModal = () => {
    modalContainer.remove();
    overlay.remove();
  };

  overlay.addEventListener("click", closeModal);
  modalContainer.querySelector(".btn-cancel-filter").addEventListener("click", closeModal);
  
  modalContainer.querySelector(".btn-apply-filter").addEventListener("click", () => {
    const checkedValues = Array.from(itemCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    
    // Se todos estiverem marcados, enviamos 'null' para significar "sem filtro"
    const isAllSelected = checkedValues.length === uniqueValues.length;
    onApply(column.key, isAllSelected ? null : checkedValues);
    closeModal();
  });
}