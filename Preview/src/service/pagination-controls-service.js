import { renderPagination } from "../components/pagination-controls.js";

let paginaAtual = 1;
let totalPaginas = null;
let primeiroItemPagina = null;
let ultimoItemPagina = null;
let totalItensPagina = null;
let tamanhoPagina = 20;
let offset = (paginaAtual -1) * tamanhoPagina;

let pagination = {
    paginaAtual, 
    totalPaginas, 
    primeiroItemPagina, 
    ultimoItemPagina,
    totalItensPagina
}

export function initPaginationControls(qtdRegistros) {
    primeiroItemPagina = 1;
    ultimoItemPagina = offset * tamanhoPagina;
    totalItensPagina = qtdRegistros;
    totalPaginas = Math.trunc(qtdRegistros / tamanhoPagina);
    
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

const irParaPagina = (page) => {
    //JSK.consultarPaginado(query, params, tamanhoPagina, offset)
    paginaAtual = page;
    offset = (page -1) * tamanhoPagina;
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