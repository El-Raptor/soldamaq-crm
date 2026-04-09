import { setActiveCodparc, atualizarTabelaPorTempo, atualizarTabelaPorCategoria } from "../main.js";

let activeFilter = "maiores-clientes";
let days = "60";


export function initFilters() {
    dataFilterListener()
    timeFilterListener()
}

const dataFilterListener = () => {
    const filterContainer = document.querySelector(".filter-container");

    filterContainer.addEventListener("click", (event) => {
        const dataFilter = event.target.closest(".data-filter");

        if (!dataFilter) return;

        const pills = document.querySelectorAll(".data-filter");
        pills.forEach(p => p.classList.remove("active"));

        dataFilter.classList.add("active"); // Usa "add" para garantir em vez de "toggle"

        activeFilter = dataFilter.id;
        
        // Faz a requisição e troca a tabela inteira
        atualizarTabelaPorCategoria(activeFilter);
        setActiveCodparc(null)
    });
}

const timeFilterListener = () => {
    const timeFilterContainer = document.querySelector(".time-filter-container");

    
    timeFilterContainer.addEventListener("click", event => {
        const timeFilter = event.target.closest(".time-filter");
        
        if (!timeFilter) return;

        const pills = document.querySelectorAll(".time-filter");
        pills.forEach(p => p.classList.remove("active"));

        timeFilter.classList.toggle("active");

        days = timeFilter.id;
        atualizarTabelaPorTempo(days);
    });
}