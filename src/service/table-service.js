import { renderRowsHTML, renderCell } from "../components/table.js";

export function initTable(dadosIniciais, config, onAbrirAnalise) {
    // ==========================================
    // 1. ESTADO ISOLADO (Tudo dentro do initTable)
    // ==========================================
    let _dadosOriginais = dadosIniciais || [];
    let _config = config;
    let _onAbrirAnalise = onAbrirAnalise;
    
    let _activeFilters = {}; 
    let _currentSortCol = null;
    let _currentSortDir = 0; 
    let _currentPage = 1;
    const _itemsPerPage = 50;

    let _filterModal = null;
    let _currentFilterCol = null;

    // Isola a tabela específica para não conflitar com outras
    const tableId = _config.tableId || 'generico';
    const tableElement = document.getElementById(tableId);
    const containerHtml = document.getElementById(`container-${tableId}`) || document.body;
    
    if (!tableElement) return;

    // ==========================================
    // 2. MÉTODOS DE RENDERIZAÇÃO
    // ==========================================
    function getDadosFiltradosEOrdenados() {
        let filtrados = _dadosOriginais.filter(row => {
            for (const colKey in _activeFilters) {
                const activeSet = _activeFilters[colKey];
                const col = _config.cols.find(c => c.key === colKey);
                const val = String(renderCell(col, row));
                if (activeSet && !activeSet.has(val)) return false;
            }
            return true;
        });

        if (_currentSortCol && _currentSortDir !== 0) {
            filtrados.sort((a, b) => {
                let valA = a[_currentSortCol];
                let valB = b[_currentSortCol];
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return (valA - valB) * _currentSortDir;
                }
                return String(valA ?? "").localeCompare(String(valB ?? ""), 'pt-BR', { numeric: true }) * _currentSortDir;
            });
        }
        return filtrados;
    }

    function atualizarDOM() {
        const dadosCompletos = getDadosFiltradosEOrdenados();
        const totalPages = Math.ceil(dadosCompletos.length / _itemsPerPage);
        if (_currentPage > totalPages) _currentPage = totalPages || 1;

        const startIndex = (_currentPage - 1) * _itemsPerPage;
        const dadosPaginados = dadosCompletos.slice(startIndex, startIndex + _itemsPerPage);

        const tbody = document.getElementById(`tbody-${tableId}`);
        if (tbody) tbody.innerHTML = renderRowsHTML(dadosPaginados, _config);
        
        renderizarPaginacao(dadosCompletos.length, totalPages);
        atualizarIconesCabecalho();
    }

    function atualizarIconesCabecalho() {
        // Remove a cor verde de todos os funis desta tabela
        tableElement.querySelectorAll('.col-filter-btn').forEach(btn => {
            if (_activeFilters[btn.dataset.col]) {
                btn.classList.add('col-filter-btn--active');
            } else {
                btn.classList.remove('col-filter-btn--active');
            }
        });
    }

    function renderizarPaginacao(totalItems, totalPages) {
        const container = document.getElementById(`pagination-${tableId}`);
        if (!container) return;

        if (totalItems === 0) {
            container.innerHTML = `<span class="pagination-info">0 registros</span>`;
            return;
        }

        const start = ((_currentPage - 1) * _itemsPerPage) + 1;
        const end = Math.min(_currentPage * _itemsPerPage, totalItems);
        const fmtTotal = new Intl.NumberFormat('pt-BR').format(totalItems);
        const textoFiltro = totalItems !== _dadosOriginais.length ? " (filtrados)" : "";
        
        container.innerHTML = `
            <span class="pagination-info">${start}-${end} de ${fmtTotal}${textoFiltro}</span>
            <button class="btn-page" id="btn-prev-page-${tableId}" ${_currentPage === 1 ? 'disabled' : ''}><i class="bi bi-chevron-left"></i></button>
            <button class="btn-page" id="btn-next-page-${tableId}" ${_currentPage === totalPages ? 'disabled' : ''}><i class="bi bi-chevron-right"></i></button>
        `;

        container.querySelector(`#btn-prev-page-${tableId}`)?.addEventListener("click", () => {
            if (_currentPage > 1) { _currentPage--; atualizarDOM(); }
        });

        container.querySelector(`#btn-next-page-${tableId}`)?.addEventListener("click", () => {
            if (_currentPage < totalPages) { _currentPage++; atualizarDOM(); }
        });
    }

    function resetarTabela() {
        _activeFilters = {};
        _currentSortCol = null;
        _currentSortDir = 0;
        _currentPage = 1;
        atualizarDOM();
    }

    // ==========================================
    // 3. LÓGICA DO MODAL NATIVO
    // ==========================================
    function getUniqueValues(colKey) {
        const col = _config.cols.find((c) => c.key === colKey);
        const seen = new Set();
        _dadosOriginais.forEach((row) => {
            seen.add(String(renderCell(col, row)));
        });
        return [...seen].sort((a, b) => a.localeCompare(b, "pt-BR", { numeric: true }));
    }

    function ensureFilterModal() {
        if (_filterModal) return _filterModal;

        _filterModal = document.createElement("div");
        _filterModal.className = `col-filter-modal modal-${tableId}`;
        _filterModal.innerHTML = `
            <div class="col-filter-modal__backdrop"></div>
            <div class="col-filter-modal__panel">
                <div class="col-filter-modal__header">
                    <span class="col-filter-modal__title"></span>
                    <button type="button" class="col-filter-modal__close" title="Fechar">&times;</button>
                </div>
                <div class="col-filter-modal__search-wrap">
                    <i class="bi bi-search col-filter-modal__search-icon"></i>
                    <input type="text" class="col-filter-modal__search" placeholder="Procurar..." autocomplete="off" />
                </div>
                <div class="col-filter-modal__actions-top">
                    <label class="col-filter-modal__item select-all-master">
                        <input type="checkbox" class="col-filter-modal__master-checkbox" />
                        <span class="col-filter-modal__item-checkmark"></span>
                        <span class="col-filter-modal__item-label" style="font-weight: bold;">Selecionar Todos</span>
                    </label>
                    <button type="button" class="col-filter-modal__clear">Limpar filtro</button>
                </div>
                <div class="col-filter-modal__list"></div>
                <div class="col-filter-modal__footer">
                    <button type="button" class="col-filter-modal__cancel">Cancelar</button>
                    <button type="button" class="col-filter-modal__ok">Aplicar</button>
                </div>
            </div>
        `;
        document.body.appendChild(_filterModal);

        const fechar = () => _filterModal.classList.remove("open");
        
        _filterModal.querySelector(".col-filter-modal__backdrop").addEventListener("click", fechar);
        _filterModal.querySelector(".col-filter-modal__close").addEventListener("click", fechar);
        _filterModal.querySelector(".col-filter-modal__cancel").addEventListener("click", fechar);
        
        // Só fecha com Esc se ESTE modal estiver aberto
        document.addEventListener("keydown", (e) => { 
            if (e.key === "Escape" && _filterModal.classList.contains("open")) fechar(); 
        });

        _filterModal.querySelector(".col-filter-modal__search").addEventListener("input", (e) => {
            const q = e.target.value.toLowerCase().trim();
            _filterModal.querySelectorAll(".col-filter-modal__item:not(.select-all-master)").forEach(item => {
                const label = item.querySelector(".col-filter-modal__item-label").textContent.toLowerCase();
                item.style.display = !q || label.includes(q) ? "" : "none";
            });
        });

        _filterModal.querySelector(".col-filter-modal__master-checkbox").addEventListener("change", (e) => {
            const isChecked = e.target.checked;
            _filterModal.querySelectorAll(".col-filter-modal__item:not(.select-all-master)").forEach(item => {
                if (item.style.display !== "none") item.querySelector("input[type=checkbox]").checked = isChecked;
            });
        });

        _filterModal.querySelector(".col-filter-modal__clear").addEventListener("click", () => {
            if (_currentFilterCol) {
                delete _activeFilters[_currentFilterCol];
                _currentPage = 1;
                fechar();
                atualizarDOM();
            }
        });

        _filterModal.querySelector(".col-filter-modal__ok").addEventListener("click", () => {
            const visibleChecked = [..._filterModal.querySelectorAll(".col-filter-modal__item:not(.select-all-master)")]
                .filter(item => item.style.display !== "none")
                .map(item => item.querySelector("input[type=checkbox]"))
                .filter(cb => cb && cb.checked)
                .map(cb => cb.value);

            const allVals = getUniqueValues(_currentFilterCol);

            if (visibleChecked.length === 0 || visibleChecked.length === allVals.length) {
                delete _activeFilters[_currentFilterCol];
            } else {
                _activeFilters[_currentFilterCol] = new Set(visibleChecked);
            }

            _currentPage = 1;
            fechar();
            atualizarDOM();
        });

        return _filterModal;
    }

    function openColumnFilter(colKey) {
        _currentFilterCol = colKey;
        const modal = ensureFilterModal();
        const col = _config.cols.find((c) => c.key === colKey);

        modal.querySelector(".col-filter-modal__title").textContent = `Filtrar: ${col?.name ?? colKey}`;
        modal.querySelector(".col-filter-modal__search").value = "";
        modal.querySelector(".col-filter-modal__master-checkbox").checked = true;

        const uniqueVals = getUniqueValues(colKey);
        const activeSet = _activeFilters[colKey] || null;

        const list = modal.querySelector(".col-filter-modal__list");
        list.innerHTML = uniqueVals.map(val => {
            const checked = !activeSet || activeSet.has(val);
            const escapedVal = val.replace(/"/g, "&quot;");
            return `
                <label class="col-filter-modal__item">
                    <input type="checkbox" value="${escapedVal}" ${checked ? "checked" : ""} />
                    <span class="col-filter-modal__item-checkmark"></span>
                    <span class="col-filter-modal__item-label">${val || "<em>(vazio)</em>"}</span>
                </label>
            `;
        }).join("");

        modal.classList.add("open");
        setTimeout(() => modal.querySelector(".col-filter-modal__search")?.focus(), 80);
    }

    // ==========================================
    // 4. EVENTOS DE CLIQUE
    // ==========================================
    function attachSortEvents() {
        tableElement.querySelectorAll(".sortable-th").forEach(th => {
            th.addEventListener("click", (e) => {
                if (e.target.closest('.col-filter-btn')) return; 
                
                const colKey = th.dataset.col;
                if (_currentSortCol === colKey) {
                    _currentSortDir = _currentSortDir === 1 ? -1 : (_currentSortDir === -1 ? 0 : 1);
                    if (_currentSortDir === 0) _currentSortCol = null;
                } else {
                    _currentSortCol = colKey;
                    _currentSortDir = 1;
                }
                atualizarDOM();
            });
        });
    }

    function attachFilterEvents() {
        tableElement.querySelectorAll(".col-filter-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                openColumnFilter(btn.dataset.col);
            });
        });
    }

    function attachRowEvents() {
        const tbody = document.getElementById(`tbody-${tableId}`);
        if (!tbody) return;

        tbody.addEventListener("click", async (event) => {
            if (event.target.closest("button")) return;
            const line = event.target.closest("tr");

            if (line && _onAbrirAnalise) {
                event.stopPropagation();
                const codparc = line.dataset.codparc;
                await _onAbrirAnalise(codparc);
            }
        })
    }

    // ==========================================
    // 5. INICIALIZAÇÃO DE FATO
    // ==========================================
    attachSortEvents();
    attachFilterEvents();
    if (_config.expandable) attachRowEvents();

    const refreshBtn = containerHtml.querySelector(".btn-refresh");
    if (refreshBtn) refreshBtn.addEventListener("click", resetarTabela);
    
    // NOVO: Adiciona o evento de exportar restrito apenas ao container desta tabela
    const exportBtn = containerHtml.querySelector(".btn-export");
    if (exportBtn) exportBtn.addEventListener("click", exportToExcel);
    
    atualizarDOM();

    // Função de exportação corrigida
    function exportToExcel() {
        if (typeof XLSX === 'undefined') {
            alert("A biblioteca XLSX não foi carregada. Adicione o script do SheetJS no seu index.html.");
            return;
        }
    
        const dadosParaExportar = getDadosFiltradosEOrdenados();
    
        if (dadosParaExportar.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }
    
        const worksheetData = dadosParaExportar.map(row => {
            const formattedRow = {};
            _config.cols.forEach(col => {
                // Ignora a coluna de ações
                if (col.key === "ACOES") return;

                // Passa o 'row' como terceiro argumento para a formatação funcionar
                let val = col.fmt ? col.fmt(row[col.key], col.qtdDecimal, row) : row[col.key];
                
                // Limpa as tags HTML (ex: <span class="pill">) para o Excel ficar com texto puro
                if (typeof val === 'string') {
                    val = val.replace(/<[^>]*>?/gm, ''); 
                    
                    // Transforma entidade HTML (ex: &quot; se houver) de volta para o caractere
                    val = val.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
                }

                formattedRow[col.name] = val ?? "";
            });
            return formattedRow;
        });
    
        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Relatorio");
    
        const fileName = `exportacao_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(workbook, fileName);
    }
}