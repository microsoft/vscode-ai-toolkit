# Microsoft Foundry Skill Status and Benchmark

Status and benchmark results for the `microsoft-foundry` skill, with prompts you can use to reproduce the same tests.

The `microsoft-foundry` skill is used by Copilot-assisted agent development in Microsoft Foundry Toolkit.

**Source code:** [`microsoft/azure-skills/skills/microsoft-foundry`](https://github.com/microsoft/azure-skills/tree/main/skills/microsoft-foundry)

**Quick links:** [Install the skill](#install-the-skill) | [Current benchmark](#current-benchmark) | [Run the benchmark yourself](#run-the-benchmark-yourself)

## Install the Skill

Install from `microsoft/azure-skills`:

```bash
npx skills add https://github.com/microsoft/azure-skills --skill microsoft-foundry
```

The skill installs to:

```text
~/.agent/skills/microsoft-foundry
```

## Verify the Installation

Start a fresh GitHub Copilot CLI session and ask:

```text
Use the microsoft-foundry skill. What can you help me do?
```

The response should mention Foundry agent workflows such as scaffolding, local testing, deployment, invocation, and evaluation.

## Current Benchmark

The Foundry skill performs consistently across different Copilot models. The benchmark tested Claude Opus 4.8, Claude Opus 4.6, Claude Sonnet 4.6, GPT-5.6 Luna, GPT-5.6 Terra, GPT-5.5, GPT-5.4, GPT-5.3-Codex, GPT-5 mini, and MAI-Code-1-Flash.

Benchmark prompt:

```text
Create a Python hosted agent for B2B customer onboarding and deploy it to a new Foundry project. Use the Responses protocol. After it is done, run in locally to make sure it can run successfully; then deploy it to foundry and ensure it can respond to users correctly
```

Representative results:

| Copilot model | Time Cost | AI Credits |
| --- | ---: | ---: |
| Sonnet 4.6 | 10 min 30 s | 100 |
| GPT-5.6 Terra | 9 min | 90 |
| GPT-5.6 Luna | 8 min | 45 |
| Auto (GPT-5.3-Codex) | 9 min 30 s | 60 |
| Free plan / cheapest (GPT-5 mini) | 11 min 30 s | 20 |

## Benchmark With and Without the Skill

This comparison uses Sonnet 4.6 on the same benchmark prompt.

| Setup | Model | Time Cost | AI Credits |
| --- | --- | ---: | ---: |
| Without the skill | Sonnet 4.6 | 33 min 20 s | 410 |
| With the skill | Sonnet 4.6 | 10 min 30 s (&#x2B07;&#xFE0F; 69%) | 100 (&#x2B07;&#xFE0F; 76%) |

## Run the Benchmark Yourself

### Prerequisites

- Azure subscription
- Azure CLI (`az`)
- Azure Developer CLI (`azd`)
- Python

### End-to-end Testing

Use the golden path prompt:

```text
Create a Python hosted agent for B2B customer onboarding and deploy it to a new Foundry project. Use the Responses protocol. After it is done, run in locally to make sure it can run successfully; then deploy it to foundry and ensure it can respond to users correctly
```

### Stage-by-stage Testing

Use these prompts when you want to isolate one scenario instead of measuring the full end-to-end path.

| Scenario | Prompt |
| --- | --- |
| 1a Configuration and scaffolding (greenfield) | `Create a Python hosted agent for B2B customer onboarding and set up whatever I need.` |
| 1b Configuration and scaffolding (brownfield) | `I have an existing agent built with the OpenAI SDK. I want to deploy it as a Foundry hosted agent. What do I need to change?` |
| 2 Local testing | `Help me run this agent locally and test it before I deploy.` |
| 3 Deployment | `I'm happy with it locally. Deploy this to Foundry.` |
| 4 Direct Toolbox iteration | `Add a WorkIQ tool to my deployed Foundry agent and redeploy.` |
| 4-iter Casual iteration | `Can my agent also look up emails and meetings from my Outlook to help with onboarding?` |
