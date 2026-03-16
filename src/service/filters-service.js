import { renderDataFilter, renderPillsContainer } from "../components/filter-btns.js";
import { loadTable as reloadTable } from "./customer-table-service.js";

let activeFilter = "maiores-clientes";
let days = "60";


export function initFilters() {
    renderDataFilter();
    renderPillsContainer();

    dataFilterListener()
    timeFilterListener()
}

const dataFilterListener = () => {
    const pillButtons = document.querySelectorAll(".pill-button")
    pillButtons.forEach(pillButton => {
        pillButton.addEventListener("click", () => {
            const pills = document.querySelectorAll(".pill-button");
            pills.forEach(p => p.classList.remove("active"));

            pillButton.classList.toggle("active")

            activeFilter = pillButton.id;
            // setActiveCodpar(null) -- Remove Codparc selecionado - antes de fazer isso, tratar valor null pro codparc
        })
    })
}

const timeFilterListener = () => {
    const pillButtons = document.querySelectorAll(".time-pill-button")
    pillButtons.forEach(pillButton => {
        pillButton.addEventListener("click", () => {
            const pills = document.querySelectorAll(".time-pill-button");
            pills.forEach(p => p.classList.remove("active"));

            pillButton.classList.toggle("active")

            days = pillButton.id;
            reloadTable(days);
            // TODO: remover seleção de clientes
        })
    })
}