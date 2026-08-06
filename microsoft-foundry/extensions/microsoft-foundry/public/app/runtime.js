import { emptySelection } from "../selection-state.js";

export const state = {
    agentName: "",
    selection: emptySelection(),
    model: { name: "", color: "#10a37f" },
    deployPrompt: "deploy it as a Foundry hosted agent",
    pluginVersion: "",
    deploymentsState: { status: "idle", items: [], source: null, reason: null },
    toolboxesState: { status: "idle", items: [], reason: null },
    guardrailsState: { status: "idle", items: [], reason: null },
    skillsState: { status: "idle", items: [], reason: null },
    canvasDisconnected: false,
    identity: { signedIn: false, account: "", tenantId: "" },
    subsState: { status: "idle", items: [], reason: null },
    projState: { status: "idle", items: [], reason: null, sub: null },
    signin: { sessionId: null, timer: null, starting: false },
    init: {
        open: true,
        promptDirty: false,
        promptText: "",
        startOption: "inspireIdea",
        idea: "",
    },
    folds: { resources: false, deploy: false },
    hostedRegion: {
        status: "idle",
        location: "",
        supported: null,
        regions: [],
        docsUrl: "",
    },
    hostedAgentDeployment: {
        status: "idle",
        deployed: false,
        available: false,
        portalUrl: "",
        agentName: "",
        version: "",
        reason: "",
    },
    hostedAgents: { status: "idle", items: [], selected: "", creatingNew: false },
    pluginUpdate: {
        status: "idle",
        installedVersion: "",
        latestVersion: "",
        dismissed: false,
    },
};

const documentRef = globalThis.document;
export const root = documentRef?.getElementById("root") || null;
const toastEl = documentRef?.getElementById("toast") || null;

let renderApp = () => {};
let toastTimer = null;
let disconnectTimer = null;

const DISCONNECT_GRACE_MS = 8000;

export function setRenderHandler(handler) {
    renderApp = typeof handler === "function" ? handler : () => {};
}

export function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

export function markReconnected() {
    if (disconnectTimer) {
        clearTimeout(disconnectTimer);
        disconnectTimer = null;
    }
    const wasDisconnected = state.canvasDisconnected;
    state.canvasDisconnected = false;
    if (!wasDisconnected) return;

    for (const key of [
        "deploymentsState",
        "toolboxesState",
        "guardrailsState",
        "skillsState",
    ]) {
        if (state[key]?.status === "error") {
            state[key].status = "idle";
            state[key].reason = null;
        }
    }
    renderApp();
}

export function scheduleDisconnect() {
    if (state.canvasDisconnected || disconnectTimer) return;
    disconnectTimer = setTimeout(() => {
        disconnectTimer = null;
        state.canvasDisconnected = true;
        renderApp();
    }, DISCONNECT_GRACE_MS);
}

export async function getJSON(url) {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("HTTP " + response.status);
    markReconnected();
    return response.json();
}

export async function postJSON(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body || {}),
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
}

export function recordAction(action, resourceKind) {
    const body = resourceKind ? { action, resourceKind } : { action };
    void fetch("/api/telemetry/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive: true,
    }).catch(() => {
        /* telemetry must not affect the Canvas interaction */
    });
}

export async function sendToChat(prompt, refresh, resourceKind) {
    try {
        const body = {
            prompt,
            ...(refresh ? { refresh } : {}),
            ...(resourceKind ? { resourceKind } : {}),
        };
        const response = await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
        toast("Sent to chat \u2713");
    } catch (error) {
        const isNetwork =
            error instanceof TypeError || /failed to fetch/i.test(error.message || "");
        toast(
            isNetwork
                ? "Lost connection to the builder. Reopen the Microsoft Foundry canvas, then try again."
                : "Could not send: " + error.message,
        );
    }
}

export function withActionContext(prompt) {
    const context = [];
    const hasWorkspaceAgents =
        Array.isArray(state.hostedAgents.items) &&
        state.hostedAgents.items.some((agent) => agent?.agentName);
    if (!state.hostedAgents.creatingNew && hasWorkspaceAgents) {
        const agentName = String(
            state.hostedAgents.selected || state.agentName || "",
        ).trim();
        if (agentName) {
            context.push(
                `Apply this request to my selected workspace agent ${JSON.stringify(agentName)}.`,
            );
        }
    }

    const { subscription, project } = state.selection;
    if (project?.name) {
        const parts = [`project "${project.name}"`];
        if (subscription.name) parts.push(`in subscription "${subscription.name}"`);
        if (project.endpoint) parts.push(`(endpoint: ${project.endpoint})`);
        context.push(`Use my selected Foundry ${parts.join(" ")}.`);
    }

    return context.length ? `${prompt}\n\n${context.join("\n")}` : prompt;
}

export function portalUrl(path) {
    const { subscription, project } = state.selection;
    if (
        !subscription.id ||
        !project?.name ||
        !project.resourceGroup ||
        !project.accountName
    ) {
        return "";
    }
    const hex = subscription.id.replace(/-/g, "");
    if (!/^[0-9a-f]{32}$/i.test(hex)) return "";
    const bytes = new Uint8Array(
        hex.match(/.{2}/g).map((byte) => parseInt(byte, 16)),
    );
    const b64 = btoa(String.fromCharCode(...bytes))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return (
        `https://ai.azure.com/nextgen/r/${b64},${project.resourceGroup},,` +
        `${project.accountName},${project.name}/${path}`
    );
}

export function openPortalPage(path) {
    const url = portalUrl(path);
    if (url) {
        globalThis.window?.open(url, "_blank");
    } else {
        toast("Select a project first");
    }
}

export function openFoundryHome() {
    globalThis.window?.open("https://ai.azure.com", "_blank");
}

export function clone(id) {
    return documentRef
        ?.getElementById(id)
        ?.content.firstElementChild.cloneNode(true);
}

export function fluentIcon(name, className = "") {
    const span = documentRef.createElement("span");
    span.className = ("fi fi-" + name + " " + className).trim();
    span.setAttribute("aria-hidden", "true");
    return span;
}

export function menuMsg(text, variant) {
    const element = documentRef.createElement("div");
    element.className = "menu-msg" + (variant ? " is-" + variant : "");
    if (variant === "loading") {
        const spinner = documentRef.createElement("span");
        spinner.className = "menu-spinner";
        element.appendChild(spinner);
    }
    const label = documentRef.createElement("span");
    label.textContent = text;
    element.appendChild(label);
    return element;
}

export function menuError(text, onRetry, retryText = "Retry") {
    const element = documentRef.createElement("div");
    element.className = "menu-msg is-error";
    const label = documentRef.createElement("span");
    label.textContent = text;
    const retry = documentRef.createElement("button");
    retry.type = "button";
    retry.className = "menu-retry";
    retry.textContent = retryText;
    retry.addEventListener("click", (event) => {
        event.stopPropagation();
        onRetry();
    });
    element.append(label, retry);
    return element;
}

export function sampleNote(reason) {
    const messages = {
        not_signed_in: "Showing sample data \u2014 sign in to see live data",
        no_project: "Showing sample data \u2014 select a Foundry project to see live data",
        unauthorized: "Showing sample data \u2014 no access to this project",
        not_found: "Showing sample data \u2014 project not found",
        fetch_failed: "Showing sample data \u2014 couldn\u2019t reach Foundry",
    };
    const element = documentRef.createElement("div");
    element.className = "menu-note";
    element.textContent = messages[reason] || "Showing sample data";
    return element;
}

export function isCanvasDisconnectedReason(reason) {
    return state.canvasDisconnected || reason === "canvas_disconnected";
}

export function dataLoadError(label, reason) {
    const messages = {
        not_signed_in: `Sign in to load ${label}`,
        no_project: `Select a Foundry project to load ${label}`,
        unauthorized: `No access to load ${label}`,
        not_found: "Project not found",
        fetch_failed: "Couldn\u2019t reach Foundry",
        timeout: `Timed out loading ${label}`,
    };
    return messages[reason] || `Couldn\u2019t load ${label}`;
}

export function dataLoadErrorRow(label, reason, loader) {
    if (isCanvasDisconnectedReason(reason)) {
        return menuMsg("Reconnecting to canvas\u2026", "loading");
    }
    return menuError(dataLoadError(label, reason), loader);
}
