// Microsoft Foundry canvas client composition and bootstrap.

import { normalizeSelection } from "./selection-state.js";
import { buildIssueReportUrl, detectOperatingSystem } from "./issue-report.js";
import {
    clone,
    getJSON,
    markReconnected,
    openFoundryHome,
    openPortalPage,
    recordAction,
    root,
    scheduleDisconnect,
    sendToChat,
    setRenderHandler,
    state,
    toast,
    withActionContext,
} from "./app/runtime.js";
import {
    closeGuardrailMenu,
    closeModelMenu,
    closeSkillMenu,
    closeToolMenu,
    loadDeployments,
    loadGuardrails,
    loadSkills,
    loadToolboxes,
    renderDeployList,
    renderGuardrailList,
    renderSkillList,
    renderToolboxList,
    toggleGuardrailMenu,
    toggleModelMenu,
    toggleSkillMenu,
    toggleToolMenu,
} from "./app/resources.js";
import {
    applyFold,
    renderFolds,
} from "./app/layout.js";
import {
    applyHostedAgentDeploymentFrame,
    closeHostedAgentMenu,
    loadHostedAgentDeployment,
    loadHostedAgents,
    loadRegionSupport,
    prettyRegion,
    refreshHostedAgentsAfterSession,
    renderHostedAgentDeployment,
    renderHostedAgentPicker,
    renderRegionSupport,
    resetHostedAgentDeployment,
    toggleHostedAgentMenu,
} from "./app/hosted-agents.js";
import {
    HELP_ME_DECIDE_PROMPT,
    applyInitDefaults,
    randomInspirationIdea,
    renderInit,
    resizeInitPrompt,
    selectStartOption,
    setInitIdea,
    setInitPreviewPrompt,
    showBuildSections,
    syncInitPrompt,
} from "./app/init-agent.js";
import {
    closeProjectMenu,
    doSignOut,
    remindProjectSelection,
    renderIdentity,
    renderProjList,
    renderSelectionLabels,
    renderSubList,
    setAccordion,
    setIdentity,
    setSelection,
    startSignIn,
    toggleAccordion,
    toggleProjectMenu,
} from "./app/project-selection.js";
import {
    dismissPluginUpdate,
    loadPluginUpdate,
    renderPluginUpdate,
} from "./app/plugin-update.js";
import { closeInspector, launchInspector } from "./app/inspector.js";

function renderBuild() {
    const node = clone("tpl-build");
    if (!node || !root) return;

    renderSelectionLabels(node);
    const issueLink = node.querySelector("#githubIssueLink");
    if (issueLink) {
        issueLink.href = buildIssueReportUrl({
            operatingSystem: detectOperatingSystem(),
            pluginVersion: state.pluginVersion,
        });
        issueLink.addEventListener("click", () =>
            recordAction("report_issue"));
    }

    const modelLink = node.querySelector("#deployNewModelLink");
    const toolboxLink = node.querySelector("#addToolboxLink");
    const skillLink = node.querySelector("#createSkillLink");
    const guardrailLink = node.querySelector("#createGuardrailLink");
    if (modelLink) {
        modelLink.addEventListener("click", () => {
            recordAction("open_foundry_creation_link", "model");
            closeModelMenu();
            openPortalPage("build/models/deployments");
        });
    }
    if (toolboxLink) {
        toolboxLink.addEventListener("click", () => {
            recordAction("open_foundry_creation_link", "toolbox");
            closeToolMenu();
            openPortalPage("build/tools?tab=toolboxes");
        });
    }
    if (skillLink) {
        skillLink.addEventListener("click", () => {
            recordAction("open_foundry_creation_link", "project_skill");
            closeSkillMenu();
            openPortalPage("build/tools?tab=skills");
        });
    }
    if (guardrailLink) {
        guardrailLink.addEventListener("click", () => {
            recordAction("open_foundry_creation_link", "guardrail");
            closeGuardrailMenu();
            openPortalPage("build/guardrails/list");
        });
    }
    const playgroundLink = node.querySelector("#testPlaygroundLink");
    if (playgroundLink) {
        playgroundLink.addEventListener("click", () =>
            recordAction("test_in_foundry_portal", "agent"));
    }

    root.replaceChildren(node);
    renderDeployList();
    renderToolboxList();
    renderSkillList();
    renderGuardrailList();
    renderInit();
    renderFolds();
    renderRegionSupport();
    renderHostedAgentDeployment();
    renderHostedAgentPicker();
    renderPluginUpdate();
}

function render() {
    renderBuild();
}

export function showNewAgent(prompt = "") {
    const nextPrompt = String(prompt || "").trim();
    if (nextPrompt) {
        state.init.idea = "";
        setInitPreviewPrompt(nextPrompt);
    }
    state.hostedAgents.creatingNew = true;
    state.init.open = true;
    state.folds.resources = false;
    state.folds.deploy = false;
    render();
}

export function setInitUserPrompt(prompt) {
    if (!prompt?.trim()) return;
    showNewAgent(prompt);
    toast("Task added \u2713");
}

export function applyWorkspaceTransition(info) {
    if (!info?.hasAgent || !info.sections) return false;
    state.folds.resources = info.sections.resourcesOpen === true;
    state.folds.deploy = info.sections.deployOpen === true;
    renderFolds();
    loadHostedAgents(true);
    return true;
}

setRenderHandler(render);

root.addEventListener("click", async (event) => {
    if (event.target.closest("#updateDismissBtn")) {
        dismissPluginUpdate();
        return;
    }
    if (event.target.closest("#initToggle")) {
        const willOpen = !state.init.open;
        state.init.open = willOpen;
        if (willOpen) {
            state.folds.resources = false;
            state.folds.deploy = false;
        }
        renderInit();
        renderFolds();
        return;
    }
    if (event.target.closest("#resourcesToggle")) {
        const willOpen = !state.folds.resources;
        state.folds.resources = willOpen;
        if (willOpen) {
            state.init.open = false;
            state.folds.deploy = true;
        }
        renderInit();
        renderFolds();
        return;
    }
    if (event.target.closest("#deployToggle")) {
        state.folds.deploy = !state.folds.deploy;
        applyFold("deployBlock", state.folds.deploy);
        return;
    }
    if (event.target.closest("#initStart")) {
        if (!remindProjectSelection(event)) return;
        const textarea = document.getElementById("initPrompt");
        const text = (
            textarea ? textarea.value : state.init.promptText
        ).trim();
        if (text) {
            state.hostedAgents.creatingNew = true;
            renderHostedAgentPicker();
            renderHostedAgentDeployment();
            recordAction("start_agent_creation", "agent");
            sendToChat(withActionContext(text), "", "agent");
            showBuildSections();
        }
        return;
    }
    if (event.target.closest("#inspireIdea")) {
        setInitIdea(randomInspirationIdea());
        return;
    }
    if (event.target.closest("#decideIdea")) {
        selectStartOption("decideIdea");
        setInitPreviewPrompt(HELP_ME_DECIDE_PROMPT);
        return;
    }
    if (event.target.closest("#helloWorldIdea")) {
        selectStartOption("helloWorldIdea");
        state.init.idea = "return a friendly hello-world greeting";
        state.init.promptDirty = false;
        syncInitPrompt();
        toast("Hello world selected \u2713");
        return;
    }
    if (event.target.closest("#modelAdd")) {
        if (!remindProjectSelection(event)) return;
        toggleModelMenu();
        return;
    }
    if (event.target.closest("#deployRefresh")) {
        recordAction("refresh_resources", "model");
        loadDeployments(true);
        return;
    }
    if (event.target.closest("#toolAdd")) {
        if (!remindProjectSelection(event)) return;
        toggleToolMenu();
        return;
    }
    if (event.target.closest("#toolboxRefresh")) {
        recordAction("refresh_resources", "toolbox");
        loadToolboxes(true);
        return;
    }
    if (event.target.closest("#guardrailAdd")) {
        if (!remindProjectSelection(event)) return;
        toggleGuardrailMenu();
        return;
    }
    if (event.target.closest("#guardrailRefresh")) {
        recordAction("refresh_resources", "guardrail");
        loadGuardrails(true);
        return;
    }
    if (event.target.closest("#skillAdd")) {
        if (!remindProjectSelection(event)) return;
        toggleSkillMenu();
        return;
    }
    if (event.target.closest("#skillRefresh")) {
        recordAction("refresh_resources", "project_skill");
        loadSkills(true);
        return;
    }
    if (event.target.closest("#newHostedAgentBtn")) {
        recordAction("create_agent", "agent");
        showNewAgent();
        return;
    }
    if (event.target.closest("#hostedAgentTrigger")) {
        toggleHostedAgentMenu();
        return;
    }
    if (event.target.closest("#projectSwitch")) {
        toggleProjectMenu();
        return;
    }
    if (event.target.closest("#pmAuthBtn")) {
        if (state.identity.signedIn) {
            recordAction("sign_out");
            doSignOut();
        } else {
            recordAction("sign_in");
            startSignIn();
        }
        return;
    }
    if (event.target.closest("#createProjectLink")) {
        recordAction("open_foundry_creation_link", "project");
        closeProjectMenu();
        openFoundryHome();
        return;
    }
    const accordion = event.target.closest(".pm-acc");
    if (accordion) {
        toggleAccordion(accordion.getAttribute("data-acc"));
        return;
    }
    if (event.target.closest(".project-menu")) return;

    const comingSoon = event.target.closest("[data-soon]");
    if (comingSoon) {
        if (comingSoon.classList.contains("toggle")) {
            const enabled =
                comingSoon.getAttribute("aria-checked") === "true";
            comingSoon.setAttribute("aria-checked", String(!enabled));
        }
        toast(comingSoon.getAttribute("data-soon") + " \u2014 coming soon");
        return;
    }
    const removeChip = event.target.closest(".chip-x");
    if (removeChip) {
        removeChip.closest(".chip").remove();
        return;
    }
    if (event.target.closest("#deployBtn")) {
        if (!remindProjectSelection(event)) return;
        if (state.hostedRegion.supported === false) {
            const location = prettyRegion(state.hostedRegion.location);
            toast(
                location
                    ? `Hosted agents aren't supported in ${location} \u2014 pick a project in a supported region`
                    : "Hosted agents aren't supported in this project's region",
            );
            return;
        }
        resetHostedAgentDeployment();
        recordAction("deploy_to_foundry", "agent");
        sendToChat(
            withActionContext(state.deployPrompt),
            "deployment",
            "agent",
        );
        return;
    }
    if (event.target.closest("#inspectBtn")) {
        if (state.hostedAgents.creatingNew) {
            toast("Select an existing agent to inspect locally.");
        } else {
            recordAction("inspect_locally", "agent");
            launchInspector(event.target.closest("#inspectBtn"));
        }
    }
});

document.addEventListener("click", (event) => {
    if (event.target.closest("#inspectorBack")) closeInspector();
});

document.addEventListener("click", (event) => {
    if (!event.target.closest(".model-select")) closeModelMenu();
    if (!event.target.closest(".tool-select")) closeToolMenu();
    if (!event.target.closest(".skill-select")) closeSkillMenu();
    if (!event.target.closest(".guardrail-select")) closeGuardrailMenu();
    if (!event.target.closest(".agent-context-bar")) closeHostedAgentMenu();
    if (!event.target.closest(".project-switch")) closeProjectMenu();
});

root.addEventListener("input", (event) => {
    if (event.target.id === "pmSubSearch") renderSubList();
    else if (event.target.id === "pmProjSearch") renderProjList();
    else if (event.target.id === "initPrompt") {
        state.init.promptDirty = true;
        state.init.promptText = event.target.value;
        resizeInitPrompt(event.target);
    }
});

async function init() {
    let initialCreatePrompt = "";
    const [stateResult, projectInitResult] = await Promise.allSettled([
        getJSON("/api/state"),
        getJSON("/api/project-init"),
    ]);

    if (stateResult.status === "fulfilled") {
        const initialState = stateResult.value;
        if (initialState.agentName) state.agentName = initialState.agentName;
        if (initialState.initPrompt) {
            initialCreatePrompt = initialState.initPrompt;
        }
        if (initialState.selection) {
            state.selection = normalizeSelection(initialState.selection);
        }
        if (initialState.model) state.model = initialState.model;
        if (initialState.deployPrompt) {
            state.deployPrompt = initialState.deployPrompt;
        }
        if (initialState.pluginVersion) {
            state.pluginVersion = initialState.pluginVersion;
        }
    }

    if (projectInitResult.status === "fulfilled") {
        const projectInit = projectInitResult.value;
        if (projectInit?.ok) {
            applyInitDefaults(projectInit);
            if (Array.isArray(projectInit.agents)) {
                state.hostedAgents.items = projectInit.agents;
                state.hostedAgents.selected = projectInit.selected || "";
                state.hostedAgents.status = "ready";
            }
        }
    }
    if (initialCreatePrompt) showNewAgent(initialCreatePrompt);
    else render();

    const hostedAgentsPromise = loadHostedAgents();
    loadPluginUpdate();

    try {
        const bootstrap = await getJSON("/api/bootstrap");
        if (bootstrap?.ok) {
            if (bootstrap.identity) setIdentity(bootstrap.identity);
            setSelection(bootstrap.selection);
            renderIdentity();
        }
    } catch {
        /* retain the canvas-input selection returned by /api/state */
    }

    try {
        await loadRegionSupport();
    } catch {
        /* fail open: leave Deploy enabled */
    }

    await hostedAgentsPromise;
    await loadHostedAgentDeployment();

    try {
        const events = new EventSource("/events");
        events.addEventListener("open", () => markReconnected());
        events.addEventListener("message", (event) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === "setPrompt" && message.prompt) {
                    setInitUserPrompt(message.prompt);
                } else if (message.type === "workspaceState") {
                    applyWorkspaceTransition(message);
                } else if (message.type === "hostedAgentsChanged") {
                    refreshHostedAgentsAfterSession();
                } else if (
                    message.type === "deploymentState" &&
                    message.deployment
                ) {
                    applyHostedAgentDeploymentFrame(message.deployment);
                    loadHostedAgents(true);
                }
            } catch {
                /* ignore malformed frames */
            }
        });
        events.addEventListener("error", () => scheduleDisconnect());
    } catch {
        /* SSE unsupported: non-fatal */
    }
}

init();
