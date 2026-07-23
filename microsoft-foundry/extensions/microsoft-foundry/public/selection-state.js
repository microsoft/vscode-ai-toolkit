function text(value) {
    return typeof value === "string" ? value.trim() : "";
}

function endpointIdentity(endpoint) {
    let name = "";
    let accountName = "";
    try {
        const url = new URL(endpoint);
        const match = url.pathname.match(/\/projects\/([^/?#]+)/i);
        name = match ? decodeURIComponent(match[1]) : "";
        accountName = url.hostname.split(".")[0] || "";
    } catch {
        // An incomplete canvas input may provide a project name before an endpoint.
    }
    return { name, accountName };
}

function normalizeSubscription(value) {
    return {
        id: text(value?.id ?? value?.subscriptionId),
        name: text(value?.name ?? value?.subscriptionName),
    };
}

function normalizeProject(value, subscriptionId) {
    if (!value || typeof value !== "object") return null;
    const endpoint = text(value.endpoint ?? value.projectEndpoint).replace(/\/+$/, "");
    const parsed = endpointIdentity(endpoint);
    const name = text(value.name ?? value.projectName ?? value.project) || parsed.name;
    const hasCanonicalAccount = Object.prototype.hasOwnProperty.call(value, "accountName")
        || Object.prototype.hasOwnProperty.call(value, "account");
    if (!name && !endpoint) return null;
    return {
        subscriptionId: text(value.subscriptionId) || subscriptionId,
        name,
        endpoint,
        location: text(value.location ?? value.projectLocation),
        resourceGroup: text(value.resourceGroup ?? value.rg ?? value.projectRg),
        accountName: hasCanonicalAccount
            ? text(value.accountName ?? value.account)
            : text(value.projectAccount) || parsed.accountName,
    };
}

export function emptySelection() {
    return {
        subscription: { id: "", name: "" },
        project: null,
    };
}

export function normalizeSelection(value) {
    const source = value?.selection && !value.subscription ? value.selection : value;
    if (!source || typeof source !== "object") return emptySelection();

    let subscription = normalizeSubscription(
        source.subscription ?? {
            subscriptionId: source.subscriptionId,
            subscriptionName: source.subscriptionName,
        },
    );
    const nestedProject = source.project && typeof source.project === "object"
        ? {
            projectEndpoint: source.projectEndpoint,
            projectLocation: source.projectLocation,
            projectRg: source.projectRg,
            projectAccount: source.projectAccount,
            ...source.project,
        }
        : {
            projectEndpoint: source.projectEndpoint,
            projectName: source.projectName,
            projectLocation: source.projectLocation,
            projectRg: source.projectRg,
            projectAccount: source.projectAccount,
        };
    let project = normalizeProject(nestedProject, subscription.id);

    if (!subscription.id && project?.subscriptionId) {
        subscription = { id: project.subscriptionId, name: "" };
    }
    if (project && subscription.id && project.subscriptionId && project.subscriptionId !== subscription.id) {
        project = null;
    }

    return { subscription, project };
}

export function selectSubscription(current, value) {
    const selection = normalizeSelection(current);
    const next = normalizeSubscription(value);
    if (!next.id) return emptySelection();
    const subscription = {
        id: next.id,
        name: next.name || (selection.subscription.id === next.id ? selection.subscription.name : ""),
    };
    const project = selection.project?.subscriptionId === subscription.id
        ? selection.project
        : null;
    return { subscription, project };
}

export function selectProject(current, value, subscriptionValue) {
    const selection = subscriptionValue
        ? selectSubscription(current, subscriptionValue)
        : normalizeSelection(current);
    if (!value) return { ...selection, project: null };

    const project = normalizeProject(value, selection.subscription.id);
    if (!project) return { ...selection, project: null };

    let subscription = selection.subscription;
    if (project.subscriptionId && project.subscriptionId !== subscription.id) {
        const supplied = normalizeSubscription(subscriptionValue);
        subscription = {
            id: project.subscriptionId,
            name: supplied.id === project.subscriptionId ? supplied.name : "",
        };
    }
    return { subscription, project };
}

export function serializeSelection(value) {
    const { subscription, project } = normalizeSelection(value);
    return {
        subscriptionId: subscription.id,
        subscriptionName: subscription.name,
        projectEndpoint: project?.endpoint || "",
        projectName: project?.name || "",
        projectLocation: project?.location || "",
        projectRg: project?.resourceGroup || "",
        projectAccount: project?.accountName || "",
    };
}
