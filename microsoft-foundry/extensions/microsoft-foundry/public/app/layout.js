import { state } from "./runtime.js";

export function syncDeployDescriptionVisibility(open = state.folds.deploy) {
    const description = document.getElementById("deployDescription");
    if (!description) return;
    description.hidden = !open || !description.textContent.trim();
}

export function applyFold(blockId, open) {
    const block = document.getElementById(blockId);
    if (!block) return;
    block.setAttribute("data-open", String(open));
    const toggle = block.querySelector(".fold-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    const panel = block.querySelector(".fold-panel");
    if (panel) panel.hidden = !open;
    if (blockId === "deployBlock") syncDeployDescriptionVisibility(open);
}

export function renderFolds() {
    applyFold("resourcesBlock", state.folds.resources);
    applyFold("deployBlock", state.folds.deploy);
}
