import { getJSON, toast } from "./runtime.js";

let inspectorPollToken = 0;

export async function launchInspector(button) {
    const view = document.getElementById("inspectorView");
    const frame = document.getElementById("inspectorFrame");
    const status = document.getElementById("inspectorStatus");
    const waiting = document.getElementById("inspectorWaiting");
    if (!view || !frame) return;

    const label = button ? button.innerHTML : "";
    if (button) {
        button.disabled = true;
        button.textContent = "Starting\u2026";
    }
    if (status) status.hidden = true;

    try {
        const data = await getJSON("/api/inspect/start");
        if (data?.ok && data.url) {
            view.hidden = false;
            if (waiting) waiting.hidden = false;
            frame.src = "";

            const pollIntervalMs = 2000;
            const pollTimeoutMs = 120_000;
            inspectorPollToken += 1;
            const token = inspectorPollToken;
            const deadline = Date.now() + pollTimeoutMs;

            const poll = async () => {
                if (token !== inspectorPollToken) return;
                if (Date.now() > deadline) {
                    if (waiting) waiting.hidden = true;
                    if (status) {
                        status.textContent =
                            "Agent did not start within 2 minutes. Check the terminal for errors.";
                        status.hidden = false;
                    }
                    frame.src = data.url;
                    return;
                }
                try {
                    const result = await getJSON("/api/inspect/ready");
                    if (token !== inspectorPollToken) return;
                    if (result?.ready) {
                        if (waiting) waiting.hidden = true;
                        frame.src = data.url;
                        return;
                    }
                } catch {
                    /* network error: keep polling */
                }
                setTimeout(poll, pollIntervalMs);
            };
            setTimeout(poll, pollIntervalMs);
        } else {
            const message = data?.error || "Inspector not ready.";
            if (status) {
                status.textContent = message;
                status.hidden = false;
            }
            view.hidden = false;
            toast(message);
        }
    } catch (error) {
        toast("Could not start inspector: " + error.message);
    } finally {
        if (button) {
            button.disabled = false;
            button.innerHTML = label;
        }
    }
}

export function closeInspector() {
    const view = document.getElementById("inspectorView");
    const frame = document.getElementById("inspectorFrame");
    const waiting = document.getElementById("inspectorWaiting");
    inspectorPollToken += 1; // stop any in-flight readiness poll
    if (view) view.hidden = true;
    if (frame) frame.src = "";
    if (waiting) waiting.hidden = true;
}
