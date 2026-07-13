# Foundry Agent Canvas

A GitHub Copilot App canvas extension for designing Microsoft Foundry hosted
agents from a side panel. It combines live Foundry project discovery with
project-aware prompts to Copilot, portal handoffs, and an embedded local Agent
Inspector.

## Features

- **Project picker** - sign in, search subscriptions and Foundry projects, switch projects, and retain the
  selection across canvas reopens.
- **Live project resources** - browse deployed models, Foundry Toolboxes and
  their tools, project skills, and account guardrails.
- **Project-aware chat handoff** - model, toolbox, skill, guardrail,
  initialization, and deployment choices send a ready-to-run prompt to the
  current Copilot session with the selected project, subscription, and endpoint
  attached.
- **Embedded Agent Inspector** - **Inspect Locally** launches or reuses
  `azd ai agent run --no-inspector` in the Copilot integrated terminal, waits
  for the agent on port `8088`, and embeds the bundled inspector. Inspector
  errors can be sent back to Copilot as fix requests.

## Install

Drop this folder at `~/.copilot/extensions/foundry-agent-canvas/` for user scope, or in a repository at `.github/extensions/foundry-agent-canvas/` for project scope.

## Usage

1. Open **Foundry Agent Canvas** or ask Copilot to create a Foundry hosted agent.
2. Open the project menu, sign in if needed, and choose a subscription and
   Foundry project.
3. Initialize the agent or select existing models, toolboxes, skills, and
   guardrails. Selections are sent to Copilot for implementation.
4. Select **Deploy to Foundry** when the agent is ready.
5. Select **Inspect Locally** after the workspace contains a runnable Foundry hosted
   agent.
