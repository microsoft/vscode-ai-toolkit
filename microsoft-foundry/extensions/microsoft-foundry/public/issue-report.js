const ISSUE_FORM_URL = "https://github.com/microsoft/foundry-toolkit/issues/new";

export function detectOperatingSystem(navigatorLike = globalThis.navigator) {
    const source = [
        navigatorLike?.userAgentData?.platform,
        navigatorLike?.platform,
        navigatorLike?.userAgent,
    ].filter(Boolean).join(" ");

    if (/iphone|ipad|ipod/i.test(source)) return "iOS";
    if (/android/i.test(source)) return "Android";
    if (/windows|win32|win64/i.test(source)) return "Windows";
    if (/macintosh|macintel|mac os/i.test(source)) return "macOS";
    if (/linux/i.test(source)) return "Linux";
    return "Unknown";
}

export function buildIssueReportUrl({ operatingSystem, pluginVersion }) {
    const body = [
        "### Issue, question, or feedback",
        "",
        "<!-- Tell us what happened or what you need help with. -->",
        "",
        "### Environment",
        "",
        `- OS: ${operatingSystem || "Unknown"}`,
        `- Microsoft Foundry plugin version: ${pluginVersion || "Unknown"}`,
    ].join("\n");
    const params = new URLSearchParams({
        labels: "canvas",
        body,
    });
    return `${ISSUE_FORM_URL}?${params.toString()}`;
}
