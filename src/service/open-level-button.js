import { renderOpenLevelButton } from "../components/level-button.js";

let currentClickListener = null;

export function initOpenLevelBtn(codparc) {
    renderOpenLevelButton();

    console.log("Ativo", codparc);

    const btnNivelContainer = document.querySelector(".btn-nivel-container");

    if (currentClickListener) {
        btnNivelContainer.removeEventListener("click", currentClickListener);
    }

    currentClickListener = () => {
        console.log("Btn Container", codparc);
        openSecondLevel(codparc);
    };

    btnNivelContainer.addEventListener("click", currentClickListener);
}

function openSecondLevel(codparc) {
    if (!codparc) {
        alert("Selecione um cliente primeiro")
        return
    }
    const params = {"A_CODPARC"  : codparc};
    openLevel("02T", params)
}