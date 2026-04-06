export function renderOpenLevelButton() {
    const secaoSuperior = document.querySelector(".secao-superior");
    const btnNivelContainer = document.querySelector(".btn-nivel-container")

    if (btnNivelContainer)
        return;

    const html = `
        <!-- BOTÃO MODIFICADO: Não usa mais a variável diretamente no onclick -->
        <div class="btn-nivel-container">
            <button class="btn-nivel">
                Abrir Clientes x Grupo de Produtos
            </button>
        </div>
    `;

    secaoSuperior.insertAdjacentHTML("beforeend", html);
}