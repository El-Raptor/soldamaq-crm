const basePath = window.APP_BASE_FOLDER || ".";
const ICONS = [
    `${basePath}/src/assets/drill.gif`,
    `${basePath}/src/assets/grinder.gif`,
    `${basePath}/src/assets/hacksaw.gif`,
    `${basePath}/src/assets/wrench.gif`
];

let overlayEl = null;
let imgEl = null;
let msgEl = null;
let intervalId = null;
let currentIndex = 0;

function ensureLoadingElements() {
    if (overlayEl) return;

    // Injeta o HTML do modal direto no body
    overlayEl = document.createElement('div');
    overlayEl.className = 'custom-loading-overlay';
    overlayEl.innerHTML = `
        <div class="custom-loading-modal">
            <div class="loading-icon-container">
                <img class="loading-animated-icon" src="${ICONS[0]}" alt="Carregando..." />
            </div>
            <span class="loading-message">Obtendo dados...</span>
        </div>
    `;
    
    document.body.appendChild(overlayEl);
    imgEl = overlayEl.querySelector('.loading-animated-icon');
    msgEl = overlayEl.querySelector('.loading-message');
}

function cycleIcon() {
    // 1. Aplica o Scale Down (encolhe e some)
    imgEl.classList.add('scale-down');

    // 2. Espera os 300ms da transição do CSS acabar para trocar a imagem
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % ICONS.length;
        imgEl.src = ICONS[currentIndex];
        
        // 3. Remove o Scale Down (cresce e aparece com a nova imagem)
        imgEl.classList.remove('scale-down');
    }, 300); // Esse tempo deve ser igual ao tempo de transição no CSS
}

export function showLoading(message = "Obtendo dados...") {
    ensureLoadingElements();
    
    // Reseta pro primeiro ícone e define a mensagem
    currentIndex = 0;
    imgEl.src = ICONS[currentIndex];
    imgEl.classList.remove('scale-down');
    msgEl.textContent = message;

    // Exibe o modal desfocando o fundo
    overlayEl.classList.add('is-active');

    // Inicia o loop de 3 segundos
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(cycleIcon, 3000);
}

export function hideLoading() {
    if (!overlayEl) return;
    
    // Esconde o modal e para a animação
    overlayEl.classList.remove('is-active');
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}