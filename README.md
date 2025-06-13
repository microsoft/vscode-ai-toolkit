# AI Toolkit for Visual Studio Code

![Feature Highlight](https://aka.ms/ai-toolkit/feature-highlights-image)

## What is AI Toolkit

AI Toolkit is a powerful extension for Visual Studio Code that streamlines agent development. With AI Toolkit, you can:

- 🔍 **Explore and evaluate models** from a wide range of providers—including Anthropic, OpenAI, GitHub—or run models locally using ONNX and Ollama.
- ⚡ **Build and test agents in minutes** with prompt generation, quick starters, and seamless MCP tool integrations.

Complete features include:

| Feature | Description | Screenshot |
|---------|-------------|------------|
| [Model Catalog](https://code.visualstudio.com/docs/intelligentapps/models) | Browse and access AI models from various sources. Simplified discovery of GitHub, ONNX, Ollama, OpenAI, Anthropic, and Google models. | <img src="https://github.com/user-attachments/assets/e22102a2-562a-4861-8ad2-323040fde3d9" width="350"> |
| [Playground](https://code.visualstudio.com/docs/intelligentapps/playground) | Interactive environment for testing AI models. Quick experimentation with model capabilities including multi-modal support. | <img src="https://github.com/user-attachments/assets/83ee9f29-2692-43b0-bbef-ee4c063e79f0" width="350"> |
| [Prompt (Agent) Builder](https://aka.ms/AIToolkit/doc/agentbuilder) | Tools for creating and optimizing prompts. Iterative improvement of prompt engineering techniques. | <img src="https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_mcp_readme/mcp_debug.gif" width="350"> |
| [Bulk Run](https://code.visualstudio.com/docs/intelligentapps/bulkrun) | Execute multiple prompts across selected models. Efficient testing at scale with various inputs. | <img src="https://github.com/user-attachments/assets/1cbc5f5b-6438-4ca6-98de-36f843956baa" width="350"> |
| [Evaluate an AI model with a dataset](https://code.visualstudio.com/docs/intelligentapps/evaluation) | Test AI models against datasets using standard metrics. Measure performance with using built-in evaluators such as F1 score, relevance, similarity, and coherence or create your own evaluators. | <img src="https://github.com/user-attachments/assets/e6695e13-25ac-4741-a049-8afcf432e5b4" width="350"> |
| [Fine-tune](https://code.visualstudio.com/docs/intelligentapps/finetune) | Customize models for specific use cases. Adapt models to specialized domains and requirements. | <img src="https://github.com/user-attachments/assets/6c1e3c47-c1d9-465a-abf8-3d23dd858d99" width="350"> |

## Getting started

![Getting started](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/vsc_readme/getting_started_new.gif)

We recommend starting with models hosted by GitHub.
- Follow the [installation guide](https://code.visualstudio.com/docs/intelligentapps/overview#_install-and-setup) to set up AI Toolkit for your device.
- From the extension tree view, select **CATALOG** > **Models** to explore models available. We recommend to getting started with models hosted by GitHub.
- From the model card, select **Try in Playground** to start experimenting the capability of an AI Model.

## Build AI agents

The key feature of AI Toolkit is to build AI agents. The agent builder provides a set of tools to help you create and optimize your AI agents. You can use the agent builder to:
- ✨ Generate starter prompts with natural language
- 🔁 Iterate and refine prompts based on model responses
- 🧩 Break down tasks with prompt chaining and structured outputs
- ⚡ Test integrations with real-time runs and tool use such as MCP servers
- 💡 Generate production-ready code for rapid app development
- 🧷 Use variables in prompts
- 🧪 Run agents with test cases to validate your agent easily
- 📊 Evaluate the accuracy and performance of your agent with built-in or custom metrics
- 🔗 Function calling support: Enable agents to invoke external functions dynamically
- 🗂️ Agent versioning and version comparison for evaluation results

And a lot of features are coming soon, stay tuned for:

- 🐞 Local tracing and debugging of agents
- 🚀 Deploy your models and agents to Azure AI Foundry
- ☁️ Deploy your agent to the cloud

Agents can now connect to external tools through MCP (Model Control Protocol) servers, enabling them to perform real-world actions like querying a database, accessing APIs, or executing custom logic.

| Feature | Description | Screenshot |
|---------|-------------|------------|
| Connect to an Existing MCP Server | Use tools from command(stdio) or HTTP (server-sent event) | <img src="https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/vsc_readme/mcp_existing.gif" width="350"> |
| Build and Scaffold a New MCP Server | Start creating your own MCP server from a simple scaffold and test in Agent Builder | <img src="https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/vsc_readme/scaffold_mcp.gif" width="350"> |

## Feedback and resources

We value your feedback to help shape our roadmap. Explore our [developer documentation](https://aka.ms/AIToolkit/doc) for more features, [open issues or share suggestions on GitHub](https://aka.ms/AIToolkit/feedback), or join our [Discord community](https://aka.ms/azureaifoundry/discord) to connect with other developers.

AI Toolkit ❤️ Developer Community.

## Data and telemetry

The AI Toolkit for Visual Studio Code collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](https://privacy.microsoft.com/privacystatement) to learn more. This extension respects the `telemetry.enableTelemetry` setting which you can learn more about at [disable telemetry reporting](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).
