export function renderExportBtn() {
    return `
        <div style="${exportBtnStyles()}">
            <button class="pill-button export-btn">
                <i class="bi bi-file-earmark-excel"></i> Exportar para Excel
            </button>
        </div>`
}

function exportBtnStyles() {
    return `
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    `
}