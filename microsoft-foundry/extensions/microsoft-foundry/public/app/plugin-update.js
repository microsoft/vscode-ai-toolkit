import { getJSON, state } from "./runtime.js";

export function pluginUpdateMessage(update = state.pluginUpdate) {
    return update.latestVersion
        ? `Microsoft Foundry ${update.latestVersion} is available.`
        : "A Microsoft Foundry update is available.";
}

export function renderPluginUpdate() {
    const bar = document.getElementById("updateBar");
    if (!bar) return;
    const update = state.pluginUpdate;
    bar.hidden = update.status === "idle" || !!update.dismissed;
    if (bar.hidden) return;

    const text = document.getElementById("updateBarText");
    if (text) text.textContent = pluginUpdateMessage();
}

export function dismissPluginUpdate() {
    state.pluginUpdate = { ...state.pluginUpdate, dismissed: true };
    renderPluginUpdate();
}

export async function loadPluginUpdate() {
    try {
        const result = await getJSON("/api/plugin-update");
        if (!result?.updateAvailable) return;
        state.pluginUpdate = {
            status: "available",
            installedVersion: result.installedVersion || "",
            latestVersion: result.latestVersion || "",
            dismissed: false,
        };
    } catch {
        return;
    }
    renderPluginUpdate();
}
