# AI Toolkit for Visual Studio Code

![Feature Highlight](https://aka.ms/ai-toolkit/feature-highlights-image)

## 🤖 What is AI Toolkit

AI Toolkit is an **extension pack** for Visual Studio Code that makes AI agent development fast and delightful. It ships with the [Microsoft Foundry](https://github.com/microsoft/microsoft-foundry-for-vscode) extension built-in, giving you direct access to Microsoft Foundry resources—deploy models, manage agents, and more—without leaving VS Code.

With AI Toolkit you can:

- 🔍 **Discover and evaluate models** from a wide range of providers—Microsoft Foundry, Foundry Local, Anthropic, OpenAI, GitHub, Google, NVIDIA NIM—or run models locally with ONNX and Ollama.
- ⚡ **Build, test, and deploy AI agents** using a no-code Agent Builder for prompt agents, or write code-based hosted agents with full debugging, streaming visualization, and MCP tool integrations.

### ✨ Feature highlights

| Feature | Description | Screenshot |
|---------|-------------|------------|
| [Model Catalog](https://code.visualstudio.com/docs/intelligentapps/models) | Discover and access AI models from multiple sources including Microsoft Foundry, Foundry Local, GitHub, ONNX, Ollama, OpenAI, Anthropic, and Google. Compare models side-by-side and find the perfect fit for your use case. | ![Screenshot showing the AI Toolkit Model Catalog interface with various AI model options](https://code.visualstudio.com/assets/docs/intelligentapps/overview/catalog.png) |
| [Playground](https://code.visualstudio.com/docs/intelligentapps/playground) | Interactive chat environment for real-time model testing. Experiment with different prompts, parameters, and multi-modal inputs including images and attachments. | ![Screenshot showing the AI Toolkit Playground interface with chat messaging and model parameter controls](https://code.visualstudio.com/assets/docs/intelligentapps/overview/playground.png) |
| [Agent Builder](https://code.visualstudio.com/docs/intelligentapps/agentbuilder) | Streamlined prompt engineering and agent development workflow. Create sophisticated prompts, integrate MCP tools, and generate production-ready code with structured outputs. | ![Screenshot showing the Agent Builder interface for creating and managing AI agents](https://code.visualstudio.com/assets/docs/intelligentapps/overview/agent-builder.png) |
| [Agent Inspector](https://aka.ms/AIToolkit/doc/test-tool) | Debug, visualize, and iterate on AI agents directly within VS Code. Press F5 to launch with full debugger support, view real-time streaming responses, and visualize multi-agent workflow execution with code navigation. | ![Screenshot showing the Agent Inspector interface for debugging and visualizing AI agents](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/2026/aitk_0205/Inspector_2.png) |
| [Model Evaluation](https://code.visualstudio.com/docs/intelligentapps/evaluation) | Comprehensive model assessment using datasets and standard metrics. Measure performance with built-in evaluators (F1 score, relevance, similarity, coherence) or create custom evaluation criteria. | ![Screenshot showing the Model Evaluation interface with metrics and performance analysis tools](https://code.visualstudio.com/assets/docs/intelligentapps/overview/eval.png) |
| [Fine-tuning](https://code.visualstudio.com/docs/intelligentapps/finetune) | Customize and adapt models for specific domains and requirements. Train models locally with GPU support or leverage Azure Container Apps for cloud-based fine-tuning. | ![Screenshot showing the Fine-tuning interface with model adaptation and training controls](https://code.visualstudio.com/assets/docs/intelligentapps/overview/fine-tune.png) |
| [Model Conversion](https://code.visualstudio.com/docs/intelligentapps/modelconversion) | Convert, quantize, and optimize machine learning models for local deployment. Transform models from Hugging Face and other sources to run efficiently on Windows with CPU, GPU, or NPU acceleration. | ![Screenshot showing the Model Conversion interface with tools for optimizing and transforming AI models](https://code.visualstudio.com/assets/docs/intelligentapps/overview/conversion.png) |
| [Tracing](https://code.visualstudio.com/docs/intelligentapps/tracing) | Monitor and analyze the performance of your AI applications. Collect and visualize trace data to gain insights into model behavior and performance. | ![Screenshot showing the Tracing interface with tools for monitoring AI applications](https://code.visualstudio.com/assets/docs/intelligentapps/overview/tracing.png) |
| [Profiling (Windows ML)](https://code.visualstudio.com/docs/intelligentapps/profiling) | Diagnose the CPU, GPU, NPU resource usages of the process, ONNX model on different execution providers, and Windows Machine Learning events. | ![Screenshot showing the Profiling interface with tools for diagnosing resource usage and performance of AI applications](https://code.visualstudio.com/assets/docs/intelligentapps/overview/profiling.png) |

## 🚀 Getting started

Get up and running to interact with a model in three steps:

1. 📦 **Install** — Follow the [installation guide](https://code.visualstudio.com/docs/intelligentapps/overview#_install-and-setup) to set up AI Toolkit on your device.
2. 🗂️ **Explore models** — Open the extension tree view → **Developer Tools** → **Discover** → **Model Catalog**. We recommend starting with models hosted by GitHub.
3. 💬 **Try it out** — Select **Try in Playground** on any model card to start experimenting right away.

## 🛠️ Build AI agents

AI Toolkit gives you two paths to build AI agents—pick the one that fits your workflow:

### 🖱️ No-code: Agent Builder (Prompt Agents)

Use the [Agent Builder](https://code.visualstudio.com/docs/intelligentapps/agentbuilder) to create, test, and deploy prompt agents through a visual interface—no code required.

- ✨ Generate and improve prompts with natural language, or let **Inspire Me** draft a starting point
- 🔁 Iterate and refine prompts based on real-time model responses in the integrated Playground
- 🧩 Extend your agent with tools from the Tool Catalog or custom function calling
- 📊 Evaluate accuracy and performance with built-in or custom metrics
- 💡 Export production-ready code snippets for rapid app integration

### 🧑‍💻 Code-based: Hosted Agents (VS Code + GitHub Copilot)

Build single-agent or multi-agent workflows in code using the [Agent Framework SDK](https://github.com/microsoft/agent-framework), with full debugging and deployment support.

- 🏗️ **Code Generation** — Scaffold hosted agent code or orchestrate multi-agent workflows with GitHub Copilot
- 🔬 **[Agent Inspector](https://aka.ms/AIToolkit/doc/test-tool)** — Press F5 to launch with breakpoints, real-time streaming, workflow visualization, and one-click code navigation
- ☁️ **Cloud Deployment** — Deploy hosted agents to Microsoft Foundry
- 📈 **Observability** — Trace agent execution locally or evaluate performance with built-in and custom metrics

## 💬 Feedback and resources

We'd love to hear from you! Your feedback helps shape our roadmap.

- 📖 [Developer documentation](https://aka.ms/AIToolkit/doc) — explore all features in depth
- 🐛 [GitHub Issues](https://aka.ms/AIToolkit/feedback) — report bugs or suggest new features
- 💬 [Discord community](https://aka.ms/azureaifoundry/discord) — connect with fellow developers

AI Toolkit ❤️ Developer Community.

## 📊 Data and telemetry

AI Toolkit for Visual Studio Code collects usage data and sends it to Microsoft to help improve our products and services. Read our [privacy statement](https://go.microsoft.com/fwlink/?LinkId=521839) to learn more. This extension respects the `telemetry.enableTelemetry` setting—learn more at [disable telemetry reporting](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).
