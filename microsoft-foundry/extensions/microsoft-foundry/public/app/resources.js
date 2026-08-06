import {
    dataLoadErrorRow,
    fluentIcon,
    getJSON,
    menuMsg,
    recordAction,
    sampleNote,
    sendToChat,
    state,
    withActionContext,
} from "./runtime.js";

export function renderDeployList() {
    const host = document.getElementById("deployList");
    if (!host) return;
    const resourceState = state.deploymentsState;
    host.replaceChildren();

    if (resourceState.status === "loading") {
        return host.appendChild(menuMsg("Loading deployments\u2026", "loading"));
    }
    if (resourceState.status === "error") {
        return host.appendChild(
            dataLoadErrorRow("deployments", resourceState.reason, () =>
                loadDeployments(true)),
        );
    }
    if (resourceState.status === "ready" && resourceState.items.length === 0) {
        return host.appendChild(
            menuMsg("No model deployments in this project", "empty"),
        );
    }

    for (const model of resourceState.items) {
        const item = document.createElement("button");
        item.className = "menu-item menu-item--hover-action";
        item.type = "button";
        item.setAttribute("role", "menuitem");
        item.appendChild(fluentIcon("cube"));

        const name = document.createElement("span");
        name.className = "item-name";
        name.textContent = model.name;
        item.appendChild(name);

        const action = document.createElement("span");
        action.className = "item-action";
        action.append(fluentIcon("switch"), document.createTextNode("Switch"));
        item.appendChild(action);

        item.addEventListener("click", () => {
            closeModelMenu();
            recordAction("switch_model", "model");
            sendToChat(withActionContext(model.prompt), "", "model");
        });
        host.appendChild(item);
    }
    if (resourceState.source === "mock") {
        host.appendChild(sampleNote(resourceState.reason));
    }
}

export function renderToolboxList() {
    const host = document.getElementById("toolboxList");
    if (!host) return;
    const resourceState = state.toolboxesState;
    host.replaceChildren();

    if (resourceState.status === "loading") {
        return host.appendChild(menuMsg("Loading toolboxes\u2026", "loading"));
    }
    if (resourceState.status === "error") {
        return host.appendChild(
            dataLoadErrorRow("toolboxes", resourceState.reason, () =>
                loadToolboxes(true)),
        );
    }
    if (resourceState.status === "ready" && resourceState.items.length === 0) {
        return host.appendChild(menuMsg("No toolboxes in this project", "empty"));
    }

    for (const toolbox of resourceState.items) {
        const wrap = document.createElement("div");
        wrap.className =
            "toolbox-wrap" + (toolbox.expanded ? " is-expanded" : "");

        const item = document.createElement("div");
        item.className = "menu-item menu-item--toolbox menu-item--hover-action";

        const toggle = document.createElement("button");
        toggle.className = "toolbox-toggle";
        toggle.type = "button";
        toggle.setAttribute("role", "menuitem");
        toggle.setAttribute("aria-expanded", String(!!toolbox.expanded));

        const chevron = document.createElement("span");
        chevron.className =
            "toolbox-chev" + (toolbox.expanded ? " is-open" : "");
        chevron.setAttribute("aria-hidden", "true");
        chevron.appendChild(fluentIcon("chev"));
        toggle.appendChild(chevron);

        const icon = document.createElement("span");
        icon.className = "toolbox-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.appendChild(fluentIcon("toolbox"));
        toggle.appendChild(icon);

        const name = document.createElement("span");
        name.className = "item-name";
        const count =
            Array.isArray(toolbox.tools) && toolbox.toolsStatus === "ready"
                ? ` (${toolbox.tools.length})`
                : "";
        name.textContent = toolbox.name + count;
        toggle.appendChild(name);

        const connect = document.createElement("button");
        connect.className = "item-action toolbox-use";
        connect.type = "button";
        connect.setAttribute("aria-label", `Connect ${toolbox.name}`);
        connect.append(
            fluentIcon("plug"),
            document.createTextNode("Connect"),
        );
        connect.addEventListener("click", (event) => {
            event.stopPropagation();
            closeToolMenu();
            recordAction("connect_toolbox", "toolbox");
            sendToChat(withActionContext(toolbox.prompt), "", "toolbox");
        });
        item.append(toggle, connect);

        toggle.addEventListener("click", (event) => {
            event.stopPropagation();
            toolbox.expanded = !toolbox.expanded;
            if (toolbox.expanded) loadToolboxTools(toolbox);
            renderToolboxList();
        });
        wrap.appendChild(item);

        if (toolbox.expanded) {
            const tools = document.createElement("div");
            tools.className = "toolbox-tools";
            if (toolbox.toolsStatus === "loading") {
                tools.appendChild(menuMsg("Loading tools\u2026", "loading"));
            } else if (toolbox.toolsStatus === "error") {
                tools.appendChild(
                    state.canvasDisconnected
                        ? menuMsg("Reconnecting to canvas\u2026", "loading")
                        : menuMsg("Couldn\u2019t load tools", "empty"),
                );
            } else if ((toolbox.tools || []).length === 0) {
                tools.appendChild(menuMsg("No tools in this toolbox", "empty"));
            } else {
                for (const tool of toolbox.tools) {
                    const row = document.createElement("div");
                    row.className = "toolbox-tool";
                    row.append(
                        fluentIcon("tools", "toolbox-tool-kind"),
                        Object.assign(document.createElement("span"), {
                            textContent: tool.name,
                        }),
                    );
                    tools.appendChild(row);
                }
            }
            wrap.appendChild(tools);
        }
        host.appendChild(wrap);
    }
}

export function renderGuardrailList() {
    const host = document.getElementById("guardrailList");
    if (!host) return;
    const resourceState = state.guardrailsState;
    host.replaceChildren();

    if (resourceState.status === "loading") {
        return host.appendChild(menuMsg("Loading guardrails\u2026", "loading"));
    }
    if (resourceState.status === "error") {
        return host.appendChild(
            dataLoadErrorRow("guardrails", resourceState.reason, () =>
                loadGuardrails(true)),
        );
    }
    if (resourceState.status === "ready" && resourceState.items.length === 0) {
        return host.appendChild(
            menuMsg("No guardrails in this project", "empty"),
        );
    }

    for (const guardrail of resourceState.items) {
        const item = document.createElement("button");
        item.className = "menu-item menu-item--hover-action";
        item.type = "button";
        item.setAttribute("role", "menuitem");
        item.appendChild(fluentIcon("guardrails"));

        const name = document.createElement("span");
        name.className = "item-name";
        name.textContent = guardrail.name;
        item.appendChild(name);

        const action = document.createElement("span");
        action.className = "item-action";
        action.append(fluentIcon("plug"), document.createTextNode("Assign"));
        item.appendChild(action);

        item.addEventListener("click", () => {
            closeGuardrailMenu();
            recordAction("apply_guardrail", "guardrail");
            sendToChat(
                withActionContext(guardrail.prompt),
                "",
                "guardrail",
            );
        });
        host.appendChild(item);
    }
}

export function renderSkillList() {
    const host = document.getElementById("skillList");
    if (!host) return;
    const resourceState = state.skillsState;
    host.replaceChildren();

    if (resourceState.status === "loading") {
        return host.appendChild(menuMsg("Loading skills\u2026", "loading"));
    }
    if (resourceState.status === "error") {
        return host.appendChild(
            dataLoadErrorRow("skills", resourceState.reason, () =>
                loadSkills(true)),
        );
    }
    if (resourceState.status === "ready" && resourceState.items.length === 0) {
        return host.appendChild(menuMsg("No skills in this project", "empty"));
    }

    for (const skill of resourceState.items) {
        const item = document.createElement("button");
        item.className = "menu-item menu-item--hover-action";
        item.type = "button";
        item.setAttribute("role", "menuitem");
        item.appendChild(fluentIcon("skills"));

        const name = document.createElement("span");
        name.className = "item-name";
        name.textContent = skill.name;
        item.appendChild(name);

        const action = document.createElement("span");
        action.className = "item-action";
        action.append(fluentIcon("plug"), document.createTextNode("Connect"));
        item.appendChild(action);

        item.addEventListener("click", () => {
            closeSkillMenu();
            recordAction("add_project_skill", "project_skill");
            sendToChat(
                withActionContext(skill.prompt),
                "",
                "project_skill",
            );
        });
        host.appendChild(item);
    }
}

export async function loadToolboxTools(toolbox) {
    if (
        toolbox.toolsStatus === "ready" ||
        toolbox.toolsStatus === "loading"
    ) {
        return;
    }
    toolbox.toolsStatus = "loading";
    renderToolboxList();
    try {
        const query =
            "name=" +
            encodeURIComponent(toolbox.name) +
            (toolbox.version
                ? "&version=" + encodeURIComponent(toolbox.version)
                : "");
        const data = await getJSON("/api/toolbox/tools?" + query);
        toolbox.tools = Array.isArray(data.items) ? data.items : [];
        toolbox.toolsStatus = data.ok ? "ready" : "error";
    } catch {
        toolbox.toolsStatus = "error";
    }
    renderToolboxList();
}

export async function loadDeployments(force) {
    const resourceState = state.deploymentsState;
    if (
        !force &&
        (resourceState.status === "loading" ||
            resourceState.status === "ready")
    ) {
        return;
    }
    resourceState.status = "loading";
    renderDeployList();
    try {
        const data = await getJSON(
            force ? "/api/deployments?refresh=1" : "/api/deployments",
        );
        resourceState.source = data.source || null;
        resourceState.reason = data.reason || null;
        if (data.ok === false) {
            resourceState.items = [];
            resourceState.status = "error";
        } else {
            resourceState.items = Array.isArray(data.items) ? data.items : [];
            resourceState.status = "ready";
        }
    } catch (error) {
        resourceState.status = "error";
        resourceState.reason = state.canvasDisconnected
            ? "canvas_disconnected"
            : error.message;
    }
    renderDeployList();
}

export async function loadToolboxes(force) {
    const resourceState = state.toolboxesState;
    if (
        !force &&
        (resourceState.status === "loading" ||
            resourceState.status === "ready")
    ) {
        return;
    }
    resourceState.status = "loading";
    renderToolboxList();
    try {
        const data = await getJSON(
            force ? "/api/toolboxes?refresh=1" : "/api/toolboxes",
        );
        resourceState.reason = data.reason || null;
        if (data.ok === false) {
            resourceState.items = [];
            resourceState.status = "error";
        } else {
            resourceState.items = Array.isArray(data.items) ? data.items : [];
            resourceState.status = "ready";
        }
    } catch (error) {
        resourceState.status = "error";
        resourceState.reason = state.canvasDisconnected
            ? "canvas_disconnected"
            : error.message;
    }
    renderToolboxList();
}

export async function loadGuardrails(force) {
    const resourceState = state.guardrailsState;
    if (
        !force &&
        (resourceState.status === "loading" ||
            resourceState.status === "ready")
    ) {
        return;
    }
    resourceState.status = "loading";
    renderGuardrailList();
    try {
        const data = await getJSON(
            force ? "/api/guardrails?refresh=1" : "/api/guardrails",
        );
        resourceState.reason = data.reason || null;
        if (data.ok === false) {
            resourceState.items = [];
            resourceState.status = "error";
        } else {
            resourceState.items = Array.isArray(data.items) ? data.items : [];
            resourceState.status = "ready";
        }
    } catch (error) {
        resourceState.status = "error";
        resourceState.reason = state.canvasDisconnected
            ? "canvas_disconnected"
            : error.message;
    }
    renderGuardrailList();
}

export async function loadSkills(force) {
    const resourceState = state.skillsState;
    if (
        !force &&
        (resourceState.status === "loading" ||
            resourceState.status === "ready")
    ) {
        return;
    }
    resourceState.status = "loading";
    renderSkillList();
    try {
        const data = await getJSON(
            force ? "/api/skills?refresh=1" : "/api/skills",
        );
        resourceState.reason = data.reason || null;
        if (data.ok === false) {
            resourceState.items = [];
            resourceState.status = "error";
        } else {
            resourceState.items = Array.isArray(data.items) ? data.items : [];
            resourceState.status = "ready";
        }
    } catch (error) {
        resourceState.status = "error";
        resourceState.reason = state.canvasDisconnected
            ? "canvas_disconnected"
            : error.message;
    }
    renderSkillList();
}

export function closeModelMenu() {
    const menu = document.getElementById("modelMenu");
    const button = document.getElementById("modelAdd");
    if (menu) menu.hidden = true;
    if (button) button.setAttribute("aria-expanded", "false");
}

export function toggleModelMenu() {
    const menu = document.getElementById("modelMenu");
    const button = document.getElementById("modelAdd");
    if (!menu) return;
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    if (button) button.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) loadDeployments(false);
}

export function closeToolMenu() {
    const menu = document.getElementById("toolMenu");
    const button = document.getElementById("toolAdd");
    if (menu) menu.hidden = true;
    if (button) button.setAttribute("aria-expanded", "false");
}

export function toggleToolMenu() {
    const menu = document.getElementById("toolMenu");
    const button = document.getElementById("toolAdd");
    if (!menu) return;
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    if (button) button.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) loadToolboxes(false);
}

export function closeGuardrailMenu() {
    const menu = document.getElementById("guardrailMenu");
    const button = document.getElementById("guardrailAdd");
    if (menu) menu.hidden = true;
    if (button) button.setAttribute("aria-expanded", "false");
}

export function toggleGuardrailMenu() {
    const menu = document.getElementById("guardrailMenu");
    const button = document.getElementById("guardrailAdd");
    if (!menu) return;
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    if (button) button.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) loadGuardrails(false);
}

export function closeSkillMenu() {
    const menu = document.getElementById("skillMenu");
    const button = document.getElementById("skillAdd");
    if (menu) menu.hidden = true;
    if (button) button.setAttribute("aria-expanded", "false");
}

export function toggleSkillMenu() {
    const menu = document.getElementById("skillMenu");
    const button = document.getElementById("skillAdd");
    if (!menu) return;
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    if (button) button.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) loadSkills(false);
}

export function resetSelectors() {
    state.deploymentsState = {
        status: "idle",
        items: [],
        source: null,
        reason: null,
    };
    state.toolboxesState = {
        status: "idle",
        items: [],
        reason: null,
    };
    state.guardrailsState = {
        status: "idle",
        items: [],
        reason: null,
    };
    state.skillsState = {
        status: "idle",
        items: [],
        reason: null,
    };
    renderDeployList();
    renderToolboxList();
    renderGuardrailList();
    renderSkillList();
}
