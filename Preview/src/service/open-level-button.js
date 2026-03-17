import { renderOpenLevelButton } from "../components/level-button.js";

export function initOpenLevelBtn(codparc) {
    renderOpenLevelButton()

    const btnNivelContainer = document.querySelector(".btn-nivel-container");

    btnNivelContainer.addEventListener("click", () => {
        openSecondLevel(codparc);
    })
}

function openSecondLevel(codparc) {
    if (!codparc) {
        alert("Selecione um cliente primeiro")
        return
    }
    const params = {"A_CODPARC"  : codparc};
    openLevel("02T", params)
}