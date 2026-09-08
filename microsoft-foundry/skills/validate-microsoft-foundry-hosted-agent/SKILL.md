---
name: validate-microsoft-foundry-hosted-agent
description: Validate a Microsoft Foundry hosted-agent project against Microsoft Foundry best practices and open its validation report. Use when the user explicitly asks to validate a Foundry hosted agent or invokes this skill.
compatibility: Requires GitHub Copilot with the microsoft-foundry skill and hosted-agent-validation-report canvas.
---

# Validate a Microsoft Foundry hosted agent

Load the `microsoft-foundry` skill and follow
`foundry-agent/validate/validate.md` exactly. Treat the slash-command input as
free-form validation input.

After the canonical validation workflow writes its JSON report, open the
`hosted-agent-validation-report` canvas with:

```json
{
  "report": "<absolute or workspace-relative JSON report path>"
}
```

Use a stable canvas instance ID derived from the report ID. Do not transform
the report before opening the canvas.
