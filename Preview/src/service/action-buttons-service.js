import { exportToExcel } from "../util/export.js";

export function initButtonsListener() {
    const exportBtn = document.querySelector(".export-btn");

    exportBtn.addEventListener("click", () => {
        exportToExcel(".tabela-principal", "Relatório Clientes");
    })
}