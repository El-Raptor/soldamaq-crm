

export function renderTabContent(dados, colunas, tabId) {
    const tabsContainer = document.querySelector(".tabs-container");
    let tabContent = document.querySelector(".tab-content");
    
    if (!tabContent) {
        tabsContainer.insertAdjacentHTML("beforeend", `<div class="tab-content"></div>`);
        tabContent = document.querySelector(".tab-content");
    }

    tabContent.innerHTML = ""; 
    
    renderPane(dados, colunas, tabId);
}

function renderPane(dados, colunas, tabId) {
    const tabContent = document.querySelector(".tab-content")
    
    const html = `
        <div id="tab-${tabId}" class="tab-pane active">
            <div class="table-container">
                ${renderTable(dados[tabId], colunas[tabId], tabId)}
            </div>
        </div>
    `
    console.log(dados[tabId])

    tabContent.insertAdjacentHTML("beforeend", html)
}

function renderTable(linhas, colunas) {
    return `
        <table class="tabela-secundaria">
            <thead>
                <tr>
                ${colunas.map(col => `
                    <th class="align-${col.align}">${col.label}</th>
                `).join("")}
                </tr>    
            </thead>
            <tbody>
                ${linhas.map(row => `
                    <tr>${colunas.map(col => `<td class="align-${col.align}">${renderCell(row, col)}</td>`)
                .join("")}</tr>
                `).join("")}  
            </tbody>
        </table>
    `
}

function renderCell(row, col) {
    const val = col.fmt ? col.fmt(row[col.key]) : row[col.key]
    return val ?? "";
}