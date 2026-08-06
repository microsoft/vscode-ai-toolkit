import {
    fluentIcon,
    getJSON,
    postJSON,
    recordAction,
    state,
    toast,
} from "./runtime.js";
import {
    renderFolds,
    syncDeployDescriptionVisibility,
} from "./layout.js";
import { renderInit } from "./init-agent.js";
import { closeInspector } from "./inspector.js";

let hostedAgentDeploymentRequest = 0;

export function prettyRegion(code) {
    const value = String(code || "");
    if (!value) return "";
    const regions = {
        eastus2: "East US 2",
        northcentralus: "North Central US",
        swedencentral: "Sweden Central",
        canadacentral: "Canada Central",
        canadaeast: "Canada East",
        southeastasia: "Southeast Asia",
        polandcentral: "Poland Central",
        southafricanorth: "South Africa North",
        koreacentral: "Korea Central",
        southindia: "South India",
        brazilsouth: "Brazil South",
        westus: "West US",
        westus3: "West US 3",
        norwayeast: "Norway East",
        japaneast: "Japan East",
        francecentral: "France Central",
        germanywestcentral: "Germany West Central",
        switzerlandnorth: "Switzerland North",
        spaincentral: "Spain Central",
        australiaeast: "Australia East",
    };
    return regions[value.toLowerCase()] || value;
}

export function renderRegionSupport() {
    const warning = document.getElementById("regionWarn");
    const button = document.getElementById("deployBtn");
    const region = state.hostedRegion;
    const blocked = region.supported === false;
    if (button) {
        button.classList.toggle("is-blocked", blocked);
        button.setAttribute("aria-disabled", String(blocked));
        button.title = blocked
            ? "Hosted agents aren't supported in this project's region"
            : "";
    }
    if (!warning) return;

    warning.hidden = !blocked;
    if (!blocked) return;
    const heading = document.getElementById("regionWarnHead");
    if (heading) {
        const location = prettyRegion(region.location);
        heading.textContent = location
            ? `Hosted agents aren't available in this project's region (${location}).`
            : "Hosted agents aren't available in this project's region.";
    }
    const link = document.getElementById("regionWarnLink");
    if (link && region.docsUrl) link.href = region.docsUrl;
}

export function emptyHostedAgentDeployment(status = "idle", reason = "") {
    return {
        status,
        deployed: false,
        available: false,
        portalUrl: "",
        agentName: "",
        version: "",
        reason,
    };
}

export function resetHostedAgentDeployment() {
    hostedAgentDeploymentRequest += 1;
    state.hostedAgentDeployment = emptyHostedAgentDeployment();
    renderHostedAgentDeployment();
}

export function hasAvailableHostedAgentDeployment(deployment) {
    return !!(
        deployment?.deployed &&
        deployment?.available &&
        deployment?.portalUrl
    );
}

export function isDefinitiveHostedAgentResult(result) {
    if (result?.ok === true) return true;
    return ["no_agent", "no_project"].includes(result?.reason);
}

export function hostedAgentDeploymentFromResult(result) {
    const available = !!(
        result?.ok &&
        result?.deployed &&
        result?.available &&
        result?.portalUrl
    );
    return {
        status: "ready",
        deployed: !!result?.deployed,
        available,
        portalUrl: available ? result.portalUrl : "",
        agentName: result?.agentName || "",
        version: result?.version || "",
        reason: result?.reason || "",
    };
}

export function hostedAgentDeploymentDescription(deployment) {
    if (!deployment?.deployed) return "";
    const agentName = String(deployment.agentName || "").trim();
    const version = String(deployment.version || "").trim();
    if (agentName && version) {
        return `Deployed as ${agentName}, version ${version}.`;
    }
    if (agentName) return `Deployed as ${agentName}.`;
    if (version) return `Deployed version ${version}.`;
    return "Deployed to Microsoft Foundry.";
}

export function renderHostedAgentDeployment() {
    const link = document.getElementById("testPlaygroundLink");
    const description = document.getElementById("deployDescription");
    if (!link && !description) return;
    const deployment = state.hostedAgents.creatingNew
        ? emptyHostedAgentDeployment()
        : state.hostedAgentDeployment;
    const descriptionText = hostedAgentDeploymentDescription(deployment);
    if (description) {
        description.textContent = descriptionText;
        syncDeployDescriptionVisibility();
    }
    if (!link) return;

    const visible = hasAvailableHostedAgentDeployment(deployment);
    link.hidden = !visible;
    link.closest(".row-deploy")?.classList.toggle("has-playground", visible);
    if (visible) link.href = deployment.portalUrl;
    else link.removeAttribute("href");
    link.title =
        visible && deployment.version
            ? `Test ${deployment.agentName} version ${deployment.version} in Microsoft Foundry Portal`
            : "";
}

export async function loadHostedAgentDeployment() {
    const requestId = ++hostedAgentDeploymentRequest;
    state.hostedAgentDeployment = emptyHostedAgentDeployment("loading");
    renderHostedAgentDeployment();
    try {
        const result = await getJSON("/api/hosted-agent-deployment");
        if (requestId !== hostedAgentDeploymentRequest) return null;
        state.hostedAgentDeployment =
            hostedAgentDeploymentFromResult(result);
    } catch (error) {
        if (requestId !== hostedAgentDeploymentRequest) return null;
        state.hostedAgentDeployment = emptyHostedAgentDeployment(
            "error",
            error?.message || "fetch_failed",
        );
    }
    renderHostedAgentDeployment();
    return state.hostedAgentDeployment;
}

export function applyHostedAgentDeploymentFrame(result) {
    hostedAgentDeploymentRequest += 1;
    const previous = state.hostedAgentDeployment;
    const refreshed = hostedAgentDeploymentFromResult(result);
    state.hostedAgentDeployment =
        previous.available &&
        !refreshed.available &&
        !isDefinitiveHostedAgentResult(result)
            ? {
                  ...previous,
                  status: "ready",
                  reason: result.reason || "refresh_failed",
              }
            : refreshed;
    renderHostedAgentDeployment();
    return state.hostedAgentDeployment;
}

export function workspaceHostedAgentOptions() {
    return state.hostedAgents.items.filter((agent) => agent.agentName);
}

export function hostedAgentOptions() {
    const { selected } = state.hostedAgents;
    const options = workspaceHostedAgentOptions();
    if (
        selected &&
        !options.some(
            (agent) =>
                agent.agentName.toLowerCase() === selected.toLowerCase(),
        )
    ) {
        return [{ agentName: selected, manifestPath: "" }, ...options];
    }
    return options;
}

export function selectedHostedAgentOption(options) {
    const selected = String(state.hostedAgents.selected || "").toLowerCase();
    return (
        options.find(
            (agent) => agent.agentName.toLowerCase() === selected,
        ) || options[0]
    );
}

export function renderHostedAgentPicker() {
    const bar = document.getElementById("hostedAgentBar");
    const current = document.getElementById("hostedAgentCurrent");
    const list = document.getElementById("hostedAgentList");
    const newButton = document.getElementById("newHostedAgentBtn");
    if (!bar || !current || !list || !newButton) return;

    const workspaceOptions = workspaceHostedAgentOptions();
    const options = hostedAgentOptions();
    bar.hidden = workspaceOptions.length < 2;
    if (bar.hidden) {
        closeHostedAgentMenu();
        current.textContent = "";
        list.replaceChildren();
        return;
    }

    const creatingNew = state.hostedAgents.creatingNew === true;
    const active = selectedHostedAgentOption(options);
    const renderedName = creatingNew ? "New Agent" : active.agentName;
    current.textContent = renderedName;
    newButton.hidden = creatingNew;
    const trigger = document.getElementById("hostedAgentTrigger");
    if (trigger) {
        trigger.setAttribute("aria-label", "Working on: " + renderedName);
    }

    list.replaceChildren();
    if (creatingNew) {
        const item = document.createElement("button");
        item.className = "menu-item is-active";
        item.type = "button";
        item.setAttribute("role", "menuitemradio");
        item.setAttribute("aria-checked", "true");

        const name = document.createElement("span");
        name.className = "item-name";
        name.textContent = "New Agent";
        item.appendChild(name);
        item.appendChild(fluentIcon("check", "item-check"));
        item.addEventListener("click", closeHostedAgentMenu);
        list.appendChild(item);
    }

    for (const agent of options) {
        const isActive =
            !creatingNew &&
            agent.agentName.toLowerCase() === active.agentName.toLowerCase();
        const item = document.createElement("button");
        item.className = "menu-item" + (isActive ? " is-active" : "");
        item.type = "button";
        item.setAttribute("role", "menuitemradio");
        item.setAttribute("aria-checked", String(isActive));
        if (agent.manifestPath) item.title = agent.manifestPath;

        const name = document.createElement("span");
        name.className = "item-name";
        name.textContent = agent.agentName;
        item.appendChild(name);
        if (isActive) {
            item.appendChild(fluentIcon("check", "item-check"));
        }

        item.addEventListener("click", () => {
            closeHostedAgentMenu();
            recordAction("switch_agent", "agent");
            selectHostedAgent(agent.agentName);
        });
        list.appendChild(item);
    }
}

export function closeHostedAgentMenu() {
    const menu = document.getElementById("hostedAgentMenu");
    const button = document.getElementById("hostedAgentTrigger");
    if (menu) menu.hidden = true;
    if (button) button.setAttribute("aria-expanded", "false");
}

export function toggleHostedAgentMenu() {
    const menu = document.getElementById("hostedAgentMenu");
    const button = document.getElementById("hostedAgentTrigger");
    if (!menu) return;
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    if (button) button.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) loadHostedAgents(false);
}

export async function loadHostedAgents(force) {
    const hostedAgents = state.hostedAgents;
    if (
        !force &&
        (hostedAgents.status === "loading" ||
            hostedAgents.status === "ready")
    ) {
        return hostedAgents;
    }
    hostedAgents.status = "loading";
    try {
        const data = await getJSON("/api/hosted-agents");
        hostedAgents.items = Array.isArray(data.agents) ? data.agents : [];
        hostedAgents.selected = data.selected || "";
        hostedAgents.status = "ready";
    } catch {
        hostedAgents.status = "error";
    }
    renderHostedAgentPicker();
    return hostedAgents;
}

export async function refreshHostedAgentsAfterSession() {
    const previousNames = new Set(
        workspaceHostedAgentOptions().map((agent) =>
            agent.agentName.toLowerCase()),
    );
    const wasCreatingNew = state.hostedAgents.creatingNew === true;
    await loadHostedAgents(true);
    if (!wasCreatingNew || !state.hostedAgents.creatingNew) return;

    const added = workspaceHostedAgentOptions().filter(
        (agent) => !previousNames.has(agent.agentName.toLowerCase()),
    );
    if (added.length === 1) {
        await selectHostedAgent(added[0].agentName, { created: true });
    }
}

export async function selectHostedAgent(
    agentName,
    { created = false } = {},
) {
    const previous = state.hostedAgents.selected;
    const wasCreatingNew = state.hostedAgents.creatingNew === true;
    if (!agentName || (agentName === previous && !wasCreatingNew)) return;

    const previousSections = {
        initOpen: state.init.open,
        resourcesOpen: state.folds.resources,
        deployOpen: state.folds.deploy,
    };
    state.hostedAgents.selected = agentName;
    state.hostedAgents.creatingNew = false;
    if (wasCreatingNew) {
        state.init.open = false;
        state.folds.resources = true;
        state.folds.deploy = true;
        renderInit();
        renderFolds();
    }
    renderHostedAgentPicker();
    if (agentName !== previous) resetHostedAgentDeployment();
    if (agentName === previous) {
        renderHostedAgentDeployment();
        toast("Agent: " + agentName);
        return;
    }

    try {
        await postJSON("/api/select-hosted-agent", { agentName, created });
    } catch {
        state.hostedAgents.selected = previous;
        state.hostedAgents.creatingNew = wasCreatingNew;
        state.init.open = previousSections.initOpen;
        state.folds.resources = previousSections.resourcesOpen;
        state.folds.deploy = previousSections.deployOpen;
        renderHostedAgentPicker();
        renderInit();
        renderFolds();
        loadHostedAgentDeployment();
        toast("Couldn\u2019t switch agent.");
        return;
    }

    state.agentName = agentName;
    closeInspector();
    loadHostedAgentDeployment();
    toast("Agent: " + agentName);
}

export async function loadRegionSupport() {
    state.hostedRegion.status = "loading";
    try {
        const result = await getJSON("/api/region-support");
        if (result?.ok) {
            state.hostedRegion = {
                status: "ready",
                location: result.location || "",
                supported:
                    typeof result.supported === "boolean"
                        ? result.supported
                        : null,
                regions: Array.isArray(result.regions)
                    ? result.regions
                    : [],
                docsUrl: result.docsUrl || "",
            };
        } else {
            state.hostedRegion.status = "error";
            state.hostedRegion.supported = null;
        }
    } catch {
        state.hostedRegion.status = "error";
        state.hostedRegion.supported = null;
    }
    renderRegionSupport();
}
