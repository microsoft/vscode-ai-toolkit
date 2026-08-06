import {
    emptySelection,
    normalizeSelection,
    selectProject as transitionProject,
    selectSubscription as transitionSubscription,
} from "../selection-state.js";
import {
    fluentIcon,
    getJSON,
    menuError,
    menuMsg,
    postJSON,
    recordAction,
    state,
    toast,
} from "./runtime.js";
import {
    closeGuardrailMenu,
    closeModelMenu,
    closeSkillMenu,
    closeToolMenu,
    resetSelectors,
} from "./resources.js";
import {
    loadHostedAgentDeployment,
    loadRegionSupport,
    renderRegionSupport,
    resetHostedAgentDeployment,
} from "./hosted-agents.js";

const NO_PROJECT_LABEL = "Select a project";

export function setIdentity(value) {
    state.identity = {
        signedIn: !!value?.signedIn,
        account: value?.account || "",
        tenantId: value?.tenantId || "",
    };
}

export function setSelection(value) {
    state.selection = normalizeSelection(value);
    renderSelectionLabels();
}

export function renderSelectionLabels(scope = document) {
    const projectName = state.selection.project?.name || "";
    const display = projectName || NO_PROJECT_LABEL;
    for (const id of ["projectName", "pmProjValue"]) {
        const element = scope.querySelector(`#${id}`);
        if (element) element.textContent = display;
    }
    const subscription = scope.querySelector("#pmSubValue");
    if (subscription) {
        subscription.textContent =
            state.selection.subscription.name || "\u2014";
    }
    const dot = scope.querySelector(".project-dot");
    if (dot) dot.classList.toggle("is-unset", !projectName);
}

export function hasSelectedProject() {
    return !!state.selection.project?.name;
}

export function remindProjectSelection(event) {
    if (hasSelectedProject()) return true;
    if (event) event.stopPropagation();
    toast("Select a Foundry project first");
    closeModelMenu();
    closeToolMenu();
    closeSkillMenu();
    closeGuardrailMenu();

    const menu = document.getElementById("projectMenu");
    const button = document.getElementById("projectSwitch");
    if (menu?.hidden) {
        menu.hidden = false;
        if (button) button.setAttribute("aria-expanded", "true");
        renderIdentity();
        setAccordion("proj");
        if (state.identity.signedIn) {
            loadSubscriptions(false);
            loadProjects(false);
        }
    }
    if (button) button.focus();
    return false;
}

export function closeProjectMenu() {
    const menu = document.getElementById("projectMenu");
    const button = document.getElementById("projectSwitch");
    if (menu) menu.hidden = true;
    if (button) button.setAttribute("aria-expanded", "false");

    const subscriptionSearch = document.getElementById("pmSubSearch");
    const projectSearch = document.getElementById("pmProjSearch");
    if (subscriptionSearch?.value) {
        subscriptionSearch.value = "";
        renderSubList();
    }
    if (projectSearch?.value) {
        projectSearch.value = "";
        renderProjList();
    }
}

export function toggleProjectMenu() {
    const menu = document.getElementById("projectMenu");
    const button = document.getElementById("projectSwitch");
    if (!menu) return;
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    if (button) button.setAttribute("aria-expanded", String(willOpen));
    if (willOpen) {
        renderIdentity();
        setAccordion("proj");
        if (state.identity.signedIn) {
            loadSubscriptions(false);
            loadProjects(false);
        }
    }
}

export function renderIdentity() {
    const name = document.getElementById("pmAccount");
    const tenant = document.getElementById("pmTenant");
    const avatar = document.getElementById("pmAvatar");
    const authButton = document.getElementById("pmAuthBtn");
    const subscription = document.getElementById("pmSubValue");
    const identity = state.identity;
    if (name) {
        name.textContent = identity.signedIn
            ? identity.account || "Signed in"
            : "Not signed in";
    }
    if (tenant) {
        tenant.textContent =
            identity.signedIn && identity.tenantId
                ? "Tenant " + identity.tenantId
                : "";
    }
    if (avatar) {
        avatar.textContent =
            (identity.account || "?").trim().charAt(0) || "?";
    }
    if (authButton) {
        authButton.textContent = identity.signedIn ? "Sign Out" : "Sign In";
        authButton.disabled = false;
    }
    if (subscription) {
        subscription.textContent =
            state.selection.subscription.name || "\u2014";
    }
}

export function renderDevice(info) {
    const wrap = document.getElementById("pmDevice");
    const body = document.getElementById("pmDeviceBody");
    if (!wrap || !body) return;
    body.replaceChildren();
    if (!info) {
        wrap.hidden = true;
        body.className = "pm-device-row";
        return;
    }
    wrap.hidden = false;

    if (info.kind === "starting") {
        body.className = "pm-device-row is-busy";
        const spinner = document.createElement("span");
        spinner.className = "menu-spinner";
        const text = document.createElement("span");
        text.className = "pm-dc-label";
        text.textContent = "Starting sign-in\u2026";
        body.append(spinner, text);
        return;
    }
    if (info.kind === "interactive") {
        body.className = "pm-device-row";
        const label = document.createElement("span");
        label.className = "pm-dc-label";
        label.textContent =
            "A sign-in window has opened. Pick your account / finish sign-in there \u2014 it continues automatically.";
        const footer = document.createElement("div");
        footer.className = "pm-dc-foot";
        const wait = document.createElement("span");
        wait.className = "pm-dc-wait";
        const spinner = document.createElement("span");
        spinner.className = "menu-spinner";
        const waitText = document.createElement("span");
        waitText.textContent = "Waiting for sign-in\u2026";
        wait.append(spinner, waitText);
        const cancel = document.createElement("button");
        cancel.type = "button";
        cancel.className = "pm-dc-cancel";
        cancel.textContent = "Cancel";
        cancel.addEventListener("click", (event) => {
            event.stopPropagation();
            cancelSignIn();
        });
        footer.append(wait, cancel);
        body.append(label, footer);
        return;
    }
    if (info.kind === "error") {
        body.className = "pm-device-row";
        const text = document.createElement("span");
        text.className = "pm-dc-label";
        text.textContent = info.message || "Sign-in failed";
        body.append(text);
    }
}

export async function startSignIn() {
    if (state.signin.starting) return;
    state.signin.starting = true;
    const authButton = document.getElementById("pmAuthBtn");
    if (authButton) authButton.disabled = true;
    renderDevice({ kind: "starting" });
    try {
        const result = await postJSON("/api/signin", {});
        if (!result.ok || !result.sessionId) {
            const message =
                result.reason === "identity_missing"
                    ? "Sign-in unavailable: the @azure/identity package is missing. Run npm install."
                    : "Couldn\u2019t start sign-in. Please try again.";
            renderDevice({ kind: "error", message });
            state.signin.starting = false;
            if (authButton) authButton.disabled = false;
            return;
        }
        state.signin.sessionId = result.sessionId;
        renderDevice({ kind: "interactive" });
        state.signin.timer = setInterval(pollSignIn, 2500);
    } catch (error) {
        renderDevice({
            kind: "error",
            message: "Sign-in error: " + error.message,
        });
        state.signin.starting = false;
        if (authButton) authButton.disabled = false;
    }
}

export async function pollSignIn() {
    const sessionId = state.signin.sessionId;
    if (!sessionId) return stopSignInPolling();
    try {
        const result = await getJSON(
            "/api/signin/status?sessionId=" +
                encodeURIComponent(sessionId),
        );
        if (state.signin.sessionId !== sessionId) return;
        if (result.status === "done") {
            stopSignInPolling();
            renderDevice(null);
            if (result.identity) setIdentity(result.identity);
            renderIdentity();
            toast("Signed in \u2713");
            await afterAuthChange();
        } else if (
            result.status === "error" ||
            result.status === "cancelled"
        ) {
            stopSignInPolling();
            renderDevice(
                result.status === "cancelled"
                    ? null
                    : {
                          kind: "error",
                          message: result.error || "Sign-in failed",
                      },
            );
        } else if (!result.ok || result.status === "unknown") {
            stopSignInPolling();
            renderDevice({
                kind: "error",
                message: "Sign-in session expired. Please try again.",
            });
        }
    } catch {
        /* transient: keep polling */
    }
}

export function stopSignInPolling() {
    if (state.signin.timer) clearInterval(state.signin.timer);
    state.signin.timer = null;
    state.signin.sessionId = null;
    state.signin.starting = false;
    const authButton = document.getElementById("pmAuthBtn");
    if (authButton) authButton.disabled = false;
}

export async function cancelSignIn() {
    const sessionId = state.signin.sessionId;
    stopSignInPolling();
    renderDevice(null);
    if (!sessionId) return;
    try {
        await postJSON("/api/signin/cancel", { sessionId });
    } catch {
        /* ignore */
    }
}

export async function doSignOut() {
    const authButton = document.getElementById("pmAuthBtn");
    if (authButton) authButton.disabled = true;
    try {
        await postJSON("/api/signout", {});
    } catch {
        toast("Couldn\u2019t sign out. Please try again.");
        if (authButton) authButton.disabled = false;
        return;
    }
    setIdentity(null);
    setSelection(emptySelection());
    state.subsState = { status: "idle", items: [], reason: null };
    state.projState = {
        status: "idle",
        items: [],
        reason: null,
        sub: null,
    };
    resetProjectScopedState();
    renderIdentity();
    renderSubList();
    renderProjList();
    toast("Signed out");
    if (authButton) authButton.disabled = false;
}

export async function afterAuthChange() {
    state.subsState = { status: "idle", items: [], reason: null };
    state.projState = {
        status: "idle",
        items: [],
        reason: null,
        sub: null,
    };
    await loadSubscriptions(true);
    try {
        const bootstrap = await getJSON("/api/bootstrap");
        if (!bootstrap?.ok) return;
        if (bootstrap.identity) setIdentity(bootstrap.identity);
        let selection = normalizeSelection(bootstrap.selection);
        const match = state.subsState.items.find(
            (item) => item.id === selection.subscription.id,
        );
        if (match && !selection.subscription.name) {
            selection = transitionSubscription(selection, match);
        }
        setSelection(selection);
        resetProjectScopedState();
        if (selection.subscription.id) await loadProjects(true);
        await loadRegionSupport();
        await loadHostedAgentDeployment();
    } catch {
        toast("Signed in, but couldn\u2019t load Foundry projects.");
    }
}

export function resetProjectScopedState() {
    resetHostedAgentDeployment();
    state.hostedRegion = {
        status: "idle",
        location: "",
        supported: null,
        regions: [],
        docsUrl: "",
    };
    renderRegionSupport();
    resetSelectors();
}

export async function loadSubscriptions(force) {
    const subscriptions = state.subsState;
    if (!force && subscriptions.status === "loading") return;
    if (!force && subscriptions.status === "ready") {
        renderSubList();
        return;
    }
    subscriptions.status = "loading";
    renderSubList();
    try {
        const data = await getJSON("/api/subscriptions");
        subscriptions.items = Array.isArray(data.items) ? data.items : [];
        subscriptions.reason = data.ok ? null : data.reason;
        subscriptions.status = data.ok ? "ready" : "error";
        const selected = state.selection.subscription;
        if (selected.id && !selected.name) {
            const match = subscriptions.items.find(
                (item) => item.id === selected.id,
            );
            if (match) {
                setSelection(
                    transitionSubscription(state.selection, match),
                );
            }
        }
    } catch (error) {
        subscriptions.status = "error";
        subscriptions.reason = error.message;
    }
    renderSubList();
}

export function renderSubList() {
    const host = document.getElementById("pmSubList");
    if (!host) return;
    const search = document.getElementById("pmSubSearch");
    const query = (search ? search.value : "").trim().toLowerCase();
    const subscriptions = state.subsState;
    host.replaceChildren();
    if (subscriptions.status === "loading") {
        return host.appendChild(
            menuMsg("Loading subscriptions\u2026", "loading"),
        );
    }
    if (subscriptions.status === "error") {
        return host.appendChild(
            menuError("Couldn\u2019t load subscriptions", () =>
                loadSubscriptions(true)),
        );
    }
    const items = subscriptions.items.filter(
        (subscription) =>
            !query ||
            subscription.name.toLowerCase().includes(query) ||
            subscription.id.includes(query),
    );
    if (!items.length) {
        return host.appendChild(
            menuMsg(
                subscriptions.items.length
                    ? "No matches"
                    : "No subscriptions",
                "empty",
            ),
        );
    }
    const active = state.selection.subscription.id;
    for (const subscription of items) {
        host.appendChild(
            makePickRow(
                subscription.name,
                subscription.id,
                active === subscription.id,
                () => selectSubscription(subscription),
            ),
        );
    }
}

export async function selectSubscription(subscription) {
    recordAction("select_subscription", "subscription");
    const previousProject = state.selection.project?.endpoint || "";
    const next = transitionSubscription(state.selection, subscription);
    try {
        const result = await postJSON("/api/select-subscription", {
            subscriptionId: subscription.id,
            subscriptionName: subscription.name,
        });
        setSelection(result.selection || next);
    } catch {
        toast("Couldn\u2019t switch subscriptions.");
        return;
    }
    if (previousProject !== (state.selection.project?.endpoint || "")) {
        resetProjectScopedState();
    }
    renderSubList();
    state.projState = {
        status: "idle",
        items: [],
        reason: null,
        sub: null,
    };
    setAccordion("proj");
    await loadProjects(true);
}

export async function loadProjects(force) {
    const subscriptionId = state.selection.subscription.id;
    const projects = state.projState;
    if (!subscriptionId) {
        projects.status = "error";
        projects.reason = "no_subscription";
        return renderProjList();
    }
    if (
        !force &&
        projects.sub === subscriptionId &&
        projects.status === "loading"
    ) {
        return;
    }
    if (
        !force &&
        projects.sub === subscriptionId &&
        projects.status === "ready"
    ) {
        renderProjList();
        return;
    }
    projects.status = "loading";
    projects.sub = subscriptionId;
    renderProjList();
    try {
        const data = await getJSON(
            "/api/projects?sub=" + encodeURIComponent(subscriptionId),
        );
        projects.items = Array.isArray(data.items) ? data.items : [];
        projects.reason = data.ok ? null : data.reason;
        projects.status = data.ok ? "ready" : "error";
    } catch (error) {
        projects.status = "error";
        projects.reason = error.message;
    }
    renderProjList();
}

export function renderProjList() {
    const host = document.getElementById("pmProjList");
    if (!host) return;
    const search = document.getElementById("pmProjSearch");
    const query = (search ? search.value : "").trim().toLowerCase();
    const projects = state.projState;
    host.replaceChildren();
    if (!state.identity.signedIn) {
        return host.appendChild(
            menuMsg("Sign in to list projects", "empty"),
        );
    }
    if (projects.status === "loading") {
        return host.appendChild(menuMsg("Loading projects\u2026", "loading"));
    }
    if (projects.status === "error") {
        return host.appendChild(
            menuError("Couldn\u2019t load projects", () => loadProjects(true)),
        );
    }
    const items = projects.items.filter(
        (project) =>
            !query ||
            project.name.toLowerCase().includes(query) ||
            (project.account || "").toLowerCase().includes(query),
    );
    if (!items.length) {
        return host.appendChild(
            menuMsg(
                projects.items.length
                    ? "No matches"
                    : "No projects in this subscription",
                "empty",
            ),
        );
    }
    for (const project of items) {
        const subtitle = [
            project.account,
            project.rg,
            project.location,
        ]
            .filter(Boolean)
            .join(" \u00b7 ");
        host.appendChild(
            makePickRow(
                project.name,
                subtitle,
                state.selection.project?.endpoint ===
                    String(project.endpoint || "").replace(/\/+$/, ""),
                () => selectProject(project),
            ),
        );
    }
}

export async function selectProject(project) {
    recordAction("select_project", "project");
    const subscription = state.selection.subscription;
    const next = transitionProject(
        state.selection,
        {
            subscriptionId: project.subscriptionId || subscription.id,
            name: project.name,
            endpoint: project.endpoint,
            location: project.location,
            resourceGroup: project.rg,
            accountName: project.account,
        },
        subscription,
    );
    try {
        const result = await postJSON("/api/select-project", {
            endpoint: project.endpoint,
            name: project.name,
            location: project.location || "",
            resourceGroup: project.rg || "",
            accountName: project.account || "",
            subscriptionId: subscription.id,
            subscriptionName: subscription.name,
        });
        setSelection(result.selection || next);
    } catch {
        toast("Couldn\u2019t select that project.");
        return;
    }
    closeProjectMenu();
    resetProjectScopedState();
    toast("Project: " + project.name);
    loadRegionSupport();
    loadHostedAgentDeployment();
}

export function makePickRow(name, subtitle, active, onClick) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "pm-row" + (active ? " is-active" : "");
    const text = document.createElement("span");
    text.className = "pm-row-text";
    const title = document.createElement("span");
    title.className = "pm-row-name";
    title.textContent = name;
    text.appendChild(title);
    if (subtitle) {
        const detail = document.createElement("span");
        detail.className = "pm-row-sub";
        detail.textContent = subtitle;
        text.appendChild(detail);
    }
    row.appendChild(text);
    if (active) {
        const check = document.createElement("span");
        check.className = "item-check";
        check.appendChild(fluentIcon("check"));
        row.appendChild(check);
    }
    row.addEventListener("click", (event) => {
        event.stopPropagation();
        onClick();
    });
    return row;
}

export function setAccordion(which) {
    const accordions = {
        sub: ["pmSubAcc", "pmSubBody"],
        proj: ["pmProjAcc", "pmProjBody"],
    };
    for (const key of Object.keys(accordions)) {
        const [accordionId, bodyId] = accordions[key];
        const accordion = document.getElementById(accordionId);
        const body = document.getElementById(bodyId);
        const open = key === which;
        if (accordion) {
            accordion.setAttribute("aria-expanded", String(open));
        }
        if (body) body.hidden = !open;
    }
}

export function toggleAccordion(which) {
    const bodies = { sub: "pmSubBody", proj: "pmProjBody" };
    const body = document.getElementById(bodies[which]);
    const isOpen = body && !body.hidden;
    setAccordion(isOpen ? null : which);
    if (!isOpen) {
        if (which === "sub") loadSubscriptions(false);
        if (which === "proj") loadProjects(false);
    }
}
