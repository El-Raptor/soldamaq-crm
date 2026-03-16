import { handleExport } from "./customer-table-service.js";

export function initButtonsListener() {
    const exportBtn = document.querySelector(".export-btn");

    exportBtn.addEventListener("click", () => {
        handleExport();
    })
}