import { renderPagination } from "../components/pagination-controls.js";
import { updateTable } from "./customer-table-service.js";

let paginaAtual = 1;
let totalPaginas = null;
let primeiroItemPagina = null;
let ultimoItemPagina = null;
let totalItensPagina = null;
export const tamanhoPagina = 50;
let offset = (paginaAtual - 1) * tamanhoPagina;

let pagination = {
    paginaAtual,
    totalPaginas,
    primeiroItemPagina,
    ultimoItemPagina,
    totalItensPagina
}

export function initPaginationControls(qtdRegistros) {
    totalItensPagina = qtdRegistros;
    totalPaginas = Math.ceil(qtdRegistros / tamanhoPagina);
    primeiroItemPagina = offset + 1;
    ultimoItemPagina = Math.min(offset + tamanhoPagina, qtdRegistros);

    pagination = {
        paginaAtual,
        totalPaginas,
        primeiroItemPagina,
        ultimoItemPagina,
        totalItensPagina
    }

    renderPagination(pagination);

    firstPageListener();
    previousPageListener();
    nextPageListener();
    lastPageListener();
}

export function getOffset() {
    return offset;
}

const irParaPagina = async (page) => {
    if (page < 1 || page > totalPaginas || page === paginaAtual) return;

    paginaAtual = page;
    offset = (page - 1) * tamanhoPagina;

    // Dispara a atualização real dos dados e da tabela
    await updateTable();
}

const firstPageListener = () => {
    const btnFirstPage = document.querySelector(".btn-first-page");

    btnFirstPage.addEventListener("click", () => {
        irParaPagina(1);
    })
}

const previousPageListener = () => {
    const btnPreviousPage = document.querySelector(".btn-previous-page");

    btnPreviousPage.addEventListener("click", () => {
        irParaPagina(paginaAtual - 1)
    })
}

const nextPageListener = () => {
    const btnNextPage = document.querySelector(".btn-next-page");

    btnNextPage.addEventListener("click", () => {
        irParaPagina(paginaAtual + 1);
    })
}

const lastPageListener = () => {
    const btnLastPage = document.querySelector(".btn-last-page");

    btnLastPage.addEventListener("click", () => {
        irParaPagina(totalPaginas);
    })
}