import { state, toast } from "./runtime.js";
import { renderFolds } from "./layout.js";

export function applyInitDefaults(info) {
    const sections = info?.sections;
    if (!sections) return;
    state.init.open = sections.initOpen === true;
    state.folds.resources = sections.resourcesOpen === true;
    state.folds.deploy = sections.deployOpen === true;
}

export function sentenceCase(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function initPromptText() {
    const purpose =
        (state.init.idea || "").trim() ||
        "perform one clearly defined task from the user's text input";
    return (
        sentenceCase(purpose) +
        ". Create a foundry hosted agent for this task using Python, Microsoft Agent Framework, and the Responses protocol. " +
        "Then run it locally to make sure it runs successfully."
    );
}

export const HELP_ME_DECIDE_PROMPT =
    "Guide user through the process of creating an agent, deciding scenarios and technical stack such as coding languages, frameworks and protocols.";

const INIT_PROMPT_MIN_HEIGHT = 72;
const INIT_PROMPT_MAX_HEIGHT = 144;

const INSPIRATION_IDEAS = Object.freeze([
    "rehearse a difficult conversation by role-playing the other person, then give concise feedback on tone, clarity, and empathy",
    "turn a rough presentation topic into a compelling slide-by-slide storyline with a clear opening, flow, and close",
    "help a user compare two difficult choices by surfacing tradeoffs, assumptions, and a reasoned recommendation",
    "run a realistic behavioral interview rehearsal and coach one answer at a time using the STAR structure",
    "rewrite dense workplace text in plain language without changing its meaning, commitments, or important details",
    "transform a frustrated customer's draft into a calm, empathetic response that clearly explains the next step",
    "challenge a product idea from the perspectives of a customer, operator, skeptic, and investor to expose weak assumptions",
    "explain one complex concept through a memorable analogy tailored to the learner's stated experience level",
    "turn an unfocused meeting request into a concise agenda with one outcome, essential topics, and time boxes",
    "critique a creative brief for ambiguity, contradictions, and missing decisions, then propose a sharper version",
]);

export function randomInspirationIdea() {
    const candidates = INSPIRATION_IDEAS.filter((idea) => idea !== state.init.idea);
    return candidates[Math.floor(Math.random() * candidates.length)];
}

export function resizeInitPrompt(textarea = document.getElementById("initPrompt")) {
    if (!textarea) return;
    textarea.style.height = "auto";
    const nextHeight = Math.min(
        INIT_PROMPT_MAX_HEIGHT,
        Math.max(INIT_PROMPT_MIN_HEIGHT, textarea.scrollHeight),
    );
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
        textarea.scrollHeight > INIT_PROMPT_MAX_HEIGHT ? "auto" : "hidden";
}

export function setInitPreviewPrompt(text) {
    state.init.promptText = text;
    state.init.promptDirty = true;
    const textarea = document.getElementById("initPrompt");
    if (textarea) {
        textarea.value = text;
        resizeInitPrompt(textarea);
    }
}

export function syncInitPrompt() {
    const textarea = document.getElementById("initPrompt");
    if (!textarea) return;
    if (state.init.promptDirty) {
        textarea.value = state.init.promptText || "";
        resizeInitPrompt(textarea);
        return;
    }
    const text = initPromptText();
    state.init.promptText = text;
    textarea.value = text;
    resizeInitPrompt(textarea);
}

export function setInitIdea(idea) {
    if (!idea?.trim()) return;
    const purpose = idea.trim().replace(/[.!?]+$/, "");
    state.init.idea = purpose;
    state.init.open = true;
    state.init.startOption = "inspireIdea";

    const textarea = document.getElementById("initPrompt");
    const current =
        (textarea ? textarea.value : state.init.promptText) || initPromptText();
    const standardPrompt =
        /^.+?\. Create a foundry hosted agent for this task using Python, Microsoft Agent Framework, and the Responses protocol\./;
    const next = standardPrompt.test(current)
        ? current.replace(
              standardPrompt,
              sentenceCase(purpose) +
                  ". Create a foundry hosted agent for this task using Python, Microsoft Agent Framework, and the Responses protocol.",
          )
        : initPromptText();

    state.init.promptText = next;
    state.init.promptDirty = true;
    if (textarea) textarea.value = next;
    renderInit();
    toast("Idea added \u2713");
}

export function selectStartOption(id) {
    state.init.startOption = id;
    for (const button of document.querySelectorAll(".start-option")) {
        button.classList.toggle("is-selected", button.id === id);
    }
}

export function renderInit() {
    const block = document.getElementById("initBlock");
    if (!block) return;

    const toggle = document.getElementById("initToggle");
    const panel = document.getElementById("initPanel");
    block.setAttribute("data-open", String(state.init.open));
    if (toggle) toggle.setAttribute("aria-expanded", String(state.init.open));
    if (panel) panel.hidden = !state.init.open;
    if (!state.init.open) return;

    syncInitPrompt();
    selectStartOption(state.init.startOption || "inspireIdea");
}

export function showBuildSections() {
    state.init.open = false;
    state.folds.resources = true;
    state.folds.deploy = true;
    renderInit();
    renderFolds();
}
