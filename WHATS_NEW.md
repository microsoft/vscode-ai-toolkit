# What's New in AI Toolkit for VS Code Preview

## Version 0.14.0
This is a major milestone release with significant updates and new features:

- **Integrated Evaluation for Agent Builders**: Streamlined testing and evaluation capabilities for AI agents:
![Evaluation UI showcasing prompt and evaluation tabs](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_0519/Eval_2.png)
  - Seamlessly switch between the `Prompt` and `Evaluation` tabs for single or batch agent evaluations.
  - Utilize variables within prompts and evaluations using the `{{}}` syntax.
  - Generate synthetic data using LLMs based on provided prompts and variables.
  - Customize data generation logic directly within the interface.
  - Import and export evaluation datasets in CSV or JSONL formats.
  - Access detailed and expanded views of evaluation results.
  ![Detailed view of evaluation results](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_0519/Detail.png)
  - Manually add or modify evaluation data entries.
  - Provide quick feedback on evaluation outcomes with thumbs-up and thumbs-down indicators.

- **Built-in [Evaluators for AI Agents](https://learn.microsoft.com/azure/ai-foundry/concepts/evaluation-metrics-built-in?tabs=warning#key-dimensions-of-evaluation)**: Added predefined evaluators to enhance agent assessment:
![Agent evaluation metrics interface](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_0519/Agent_Eval.png)
  - `Intent Resolution`: measures how well the agent identifies and clarifies user intent, including asking for clarifications and staying within scope.
  - `Tool Call Accuracy`: measures the agent’s proficiency in selecting appropriate tools, and accurately extracting and processing inputs.
  - `Task Adherence`: measures how well the agent’s final response meets the predefined goal or request specified in the task.

- **Model Conversion and Optimization Tools**: Simplified processes for model conversion, quantization, optimization, and evaluation.
![Model conversion and optimization tools interface](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_0519/ModelConversion.gif)
  - **Quantization Recipes for NPUs**: Support for Intel, AMD, and Qualcomm NPU devices.
  - **Integrated Inference**: Python notebooks provided for convenient model inference within the toolkit.
  - **Workspace Management**: Customizable workflows and efficient management of model workspaces.
  - **Dedicated Python Environments**: Automatically configured standalone Python environments with all necessary dependencies for each workflow execution.

- **LoRA Adapter Training for Phi Silica**:
  - Easily initiate fine-tuning jobs on Azure directly from AI Toolkit by providing your training dataset.
  - Upon completion (typically around one hour), download your trained LoRA adapter for immediate integration into your applications via Windows AI APIs.
  - LoRA inferencing support within AI Toolkit will be available soon; meanwhile, explore LoRA capabilities through the AI Dev Gallery during Build by visiting the LoRA sample page.

- Onboarded new models from GitHub:
  - [DeepSeek-V3-0324](https://github.com/marketplace/models/azureml-deepseek/DeepSeek-V3-0324): Demonstrates notable improvements over its predecessor, DeepSeek-V3, in several key aspects, including enhanced reasoning, improved function calling, and superior code generation capabilities.
  - [Llama-4-Maverick-17B-128E-Instruct-FP8](https://github.com/marketplace/models/azureml-meta/Llama-4-Maverick-17B-128E-Instruct-FP8): Great at precise image understanding and creative writing, offering high quality at a lower price compared to Llama 3.3 70B
  - [Llama-4-Scout-17B-16E-Instruct](https://github.com/marketplace/models/azureml-meta/Llama-4-Scout-17B-16E-Instruct): Great at multi-document summarization, parsing extensive user activity for personalized tasks, and reasoning over vast codebases.
  - [MAI-DS-R1](https://github.com/marketplace/models/azureml/MAI-DS-R1): A DeepSeek-R1 reasoning model that has been post-trained by the Microsoft AI team to fill in information gaps in the previous version of the model and improve its harm protections while maintaining R1 reasoning capabilities.
  - [Phi-4-mini-reasoning](https://github.com/marketplace/models/azureml/Phi-4-mini-reasoning): Lightweight math reasoning model optimized for multi-step problem solving.
  - [Phi-4-reasoning](https://github.com/marketplace/models/azureml/Phi-4-reasoning): State-of-the-art open-weight reasoning model.
  - [cohere-command-a](https://github.com/marketplace/models/azureml-cohere/cohere-command-a): A highly efficient generative model that excels at agentic and multilingual use cases.
  - [mistral-medium-2505](https://github.com/marketplace/models/azureml-mistral/mistral-medium-2505): Mistral Medium 3 is an advanced Large Language Model (LLM) with state-of-the-art reasoning, knowledge, coding and vision capabilities.
  - [mistral-small-2503](https://github.com/marketplace/models/azureml-mistral/mistral-small-2503): Enhanced Mistral Small 3 with multimodal capabilities and a 128k context length.
  - [o3](https://github.com/marketplace/models/azure-openai/o3): o3 includes significant improvements on quality and safety while supporting the existing features of o1 and delivering comparable or better performance.
  - [o4-mini](https://github.com/marketplace/models/azure-openai/o4-mini): o4-mini includes significant improvements on quality and safety while supporting the existing features of o3-mini and delivering comparable or better performance.

## Version 0.12.0
This is a major milestone release with significant updates and new features:

- **Agent Development**: Introducing **Agent (Prompt) Builder**, evolved from the **Prompt Builder**. The new Agent (Prompt) Builder allows you to create and manage agents with a more intuitive interface. You can now easily create, edit, and test agents in a user-friendly environment. Key features include:
![Agent Builder](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_0421/Agent_Builder_2.png)
  - **Refreshed User Interface**: The new Agent (Prompt) Builder offers a refreshed user interface, making it easier to create, edit, and test agents.
    - Restructured the UI to use a input and output panel design
    - Move `Structure output` from right output panel to left input panel
    - Move `Run` button to the bottom of input panel
    - Move `View Code` button to the bottom of output panel
  - **Quick Starter**: The `Web Developer` agent on quick starter can use a file system MCP tool to store assets in local disk.
  - **MCP Tool Integration**: Build an agent that can use various MCP tools. AI Toolkit enables you to:
    - Connect to an existing MCP server via `stdio` or `sse`.
    - Create your own MCP server from `Weather MCP Server` scaffold using your preferred programming language, either TypeScript or Python.
    - Test and debug your MCP server in AI Toolkit Agent Builder or using the MCP Inspector.
    - Discover and configure the featured MCP server built by MCP Reference implementations, Microsoft and communities.
    
- **Models Enhancements**: We are continuing to refresh the collections of models and the experience of using them:
  - Onboarded [GPT-4.1](https://openai.com/index/gpt-4-1/): A new series of GPT models featuring major improvements on coding, instruction following, and long context.
  - Enhanced onboarding experience for prompting to use a default model `GPT-4o` when there is no explicit model selected.
  - Refreshed the Popular Models section:
    - Added `Phi-4 (via ONNX)`
    - Added `GPT-4.1 (via GitHub)`
    - Added `GPT-o1 (via GitHub)`
    - Removed `QwQ (via Ollama)`
    - Removed `Claude 3.7 Sonnet (via Anthropic)`
    - Removed `GPT-4.5 Preview (via OpenAI)`

## Version 0.10.9
This version is an incremental release with feature improvements:
- Improved the **Tutorial** with richer user interface so that you can easily browse and start a tutorial.
  ![Tutorial](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_0331/Tutorial.gif)
- Added Starter Prompts in **Prompt Builder** for quick getting started with building prompts.
  ![Starter](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_0331/Starter.gif)

## Version 0.10.7

This version is an incremental release with feature improvements and bug fixes:
- Support Nvida NIM models running on Windows AI PCs.
  ![NIM](https://raw.githubusercontent.com/MuyangAmigo/MuyangAmigo/main/assets/aitk_0331/NIM.png)

## Version 0.10.5
This version is an incremental release with feature improvements and bug fixes:

- **Tutorials**: Introduce first set of tutorials for common prompt engineering practices. Start one with **CATALOG** > **Tutorials**  
  ![tutorials](https://github.com/user-attachments/assets/240d4034-7731-4975-905d-3241e97293a1)

- **Compare** model responses in Playground  
  ![compare](https://github.com/user-attachments/assets/8144c63a-3f1f-4a5a-948b-916dff07512d)

- **Think Mode** for Claude 3.7 Sonnet model in **Playground** and **Prompt Builder**  
  ![think_in_pb](https://github.com/user-attachments/assets/b42dce7d-2f12-4531-9658-0d1d0079276a)

- **Model Additions**:
  - [QwQ](https://qwenlm.github.io/blog/qwq-32b/) via Ollama: Thinking and reasoning model of the Qwen series.
  - [GPT-4.5](https://openai.com/index/introducing-gpt-4-5/) from OpenAI: A general-purpose LLM targeted at providing more natural, fluid interactions that are humanlike.
  - [DeepSeek v3](https://github.blog/changelog/2025-03-07-deepseek-v3-is-now-generally-available-in-github-models/) via GitHub: Strong performance in coding, math and reasoning tasks.

- Incremental feature enhancements:
  - **Playground** improvements:
    - Copy model response
    - Regenerate response with the same or a different model
  - **Model Catalog** improvements:
    - Quick access to `Claude 3.7 Sonnet`, `GPT-4.5` and `QwQ` model via `Popular Models`
    - Filter models by features such as Web Search, Attachment and Structured Outputs

## Version 0.10.2
This version is an incremental release with feature improvements and bug fixes:
- More AI models are supported:
  - [Anthropic Claude 3.7 Sonnet](https://www.anthropic.com/news/claude-3-7-sonnet) model (excluding `extended thinking mode`)
  - [Phi-4-mini-instruct](https://github.com/marketplace/models/azureml/Phi-4-mini-instruct)
  - [Phi-4-multimodal-instruct](https://github.com/marketplace/models/azureml/Phi-4-multimodal-instruct)
- Playground improvements:
  - Add web search support for models that are capable doing it (e.g., Gemini 2.0)
  - Add support to extract file content (text, PDF, JSON...) for models lacking native attachment support
  - Recommend conversation starters when opening Playground
  - Add default pre-selected model when opening Playground 
- Prompt Builder improvement:
  - Improve the UI to help new user get started 

## Version 0.10.1
This is an incremental release with feature enhancements and bug fixes:
- Improved model catalog experiences:
  - Streamline Ollama lifecycle (download, load, multi quantization in one card)
  - Enable access of popular Ollama models in model catalog
  - Categorize models for easy model discovery
  - Search models
- Playground improvements:
  - Auto naming the new playground/prompt
  - New playground carries over the last model selection & preference
- UI improvements:
  - Group my models by host in tree view
  - Support streaming response in Prompt Builder

## Version 0.10.0
This is a major milestone release with new feature additions and updates:
  - More AI Models:
    - GitHub hosted o3-mini model
    - Google Gemini 2.0 models
    - Anthropic Claude 3.5 Haiku model
    - Nvidia hosted NIM models
  - Prompt Builder:
    - Allow easy prompt creating / editing / testing
    - Generate prompt using AI models
    - Support structured output
    - Generate ready code to interact prompts with AI model 
  - Playground Improvements:
    - Refined Deepseek-R1 thought UI
    - Refined Markdown and Latex rendering from model output
  - Bulk Run Improvements:
    - Generate dataset using AI models
    - Support structured output
  - Custom Evaluator:
    - Custom evaluator from Python codes
    - Custom evaluator from LLM prompt
    

## Version 0.8.6
This is a patch version to the major milestone release 0.8.0 with feature improvement:
  - Support DeepSeek R1 Distilled (qwen 1.5B) NPU Model for Copilot+ PCs
    - Supported SKU:
      - Qualcomm Snapdragon X   
      - Intel Core Ultra 200V - coming soon

## Version 0.8.5
This is a patch version to the major milestone release 0.8.0 with feature improvement:
  - Support DeepSeek-R1 Model

## Version 0.8.3
This is a patch version to the major milestone release 0.8.0 with some feature improvements and bug fixes:
   - Support chat history management in Playground.
   - Support prompt templating with variable in Bulk Run.

## Version 0.8.0
This is a milestone release with core feature additions and improvements
  - Support Bulk Run that user can run any prompts from imported datasets or run in full bulk 
  - Evaluate a dataset with a set of pre-defined popular evaluators
  - Incremental UI/UX improvements and bug fixes

## Version 0.6.2
This is a patch version to the major milestone release v0.6.0, with some highly demanded feature improvements and bug fixes:
  - Support Ollama models from more UI entries with improved doc
  - Support Intel-based Mac (ONNX models support coming next)
  - Support attachment for selected GitHub multi-modal models: (Llama-3.2-11B-Vision-Instruct / Llama-3.2-90B-Vision-Instruct / gpt-4o / gpt-4o-mini / Phi-3.5-vision-instruct)
  - Added direct entry of developer documentation from AI Toolkit treeview 
  - Support responsive UI for attachments
  - Count the total tokens used in each playground conversation
  - Multiple bug fixes

## Version 0.6.0
This is a major milestone release with significant additions of features and resources.

  - Most popular generative AI models on market are now supported:
    - GitHub models
    - ONNX optimized models that run on local CPU (including Windows optimized Small Language Models like Phi family)
    - Anthropic Claude Models
    - Google Gemini Models
    - Meta Llama Models
    - And more
  - Bring your own model as remote model.
  - Quickly discover a model by comprehensive filters and detailed model card in model catalog.
  - Inference test and chat with a model in Playground with improved experience.
  - Attachment in playground chat is now supported for multi-modal models.
  - Further improved get started guide.
    
With these features, developers can easily get start and explore any popular genAI model from a single tool. 

## Version 0.5.0
0.5.x are pre-released versions with major improvements on model selections and playground experience.

  - GitHub AI models are now supported (Requiring proper GitHub License).
  - Filters are added on model catalog.
  - Models run in AI Toolkit can now be edited and deleted.
  - In-code evaluation sample published.
  - Get started guide with a simple Small Language Model is now available for new users.

## Version 0.4.0
This version adds the key support for Mac users and AI PC users:

  - Mac-Silicon (M1, M2, etc.) is now supported, Mac-Intel is not yet supported.
  - Mac doesn't have NVidia GPUs, so we hide local finetuning entry for Mac version AI Toolkit.
  - AI PC (Copilot PC) is supported.

We are excited to announce another important feature:
    
  - Remote inference test in playground is now supported, through connecting to remote model endpoint. Both UI and Command Palette have entry for connecting to a remote model endpoint.

## Version 0.3.0
We are excited to announce that Windows AI Studio has been renamed to AI Toolkit for Visual Studio Code, to expand its support of broader range of AI models, covering major scenarios for AI Engineers or App Developers to develop intelligent app with AI models. With this preview version 0.3.0, we are introducing many new features and enhancements:

**Redesigned UI**

We have made significant UI design updates to improve the visuals and user experiences.

**Model catalog**

The new Model catalog helps developer to easily discover and download a supported text generation AI model to local environment. In this version we support:

   - Phi-2 
   - Phi-3-mini with a variety of sizes and CPU/GPU supports
   - mistral-7b

**Playground for inference**

Downloaded models are ready to test inference with newly enhanced UI on local environment, with proper CPU or GPU support.

**Fine-tune model locally**

If developer's local environment has GPU support, model fine-tuning can be performed on local machine, after passing the pre-requisite test. Current supported models for fine-tuning:

   - meta-llama/Llama-2-7b
   - microsoft/phi-2
   - mistralai/Mistral-7B
   - microsoft/phi-1_5
   - microsoft/Phi-3-mini-4k-instruct
   - HuggingFaceH4/zephyr-7b-beta

**Fine-tune model remotely**

This is a preview feature that can be enabled from Visual Studio Code settings. For developers who have access to Azure cloud resources with GPU, they can perform the fine-tune jobs on Azure Container App remotely from Visual Studio Code.

**Deploy models**

Fine-tuned models can be deployed to a provisioned Azure Container App for testing or integrating.

**Coming soon**

We are actively adding support for e2e development needs around AI app and AI models.
   - Add more models for inference and fine-tune support.
   - Enable batch test and auto-evaluation of AI models.
   - Streamlined development and test support for intelligent apps with AI models.
   - Enhacing RAG and Prompt engineering support for developing and testing AI apps with AI models.


## Version 0.2.4

The selection of Windows optimized models is now available in Windows AI Studio. You can download those models from Hugging Face and GitHub and use in your Windows applications.

## Version 0.2.3

This version adds a prerequisite check, ensuring that VS Code does not have a remote connection.

## Version 0.2.2

This version fixes a few bugs, including -

- Conda environment fails to install in certain cases.

## Version 0.2.0

We are excited to introduce Windows AI Studio Preview version 0.2.0, which brings several new features and enhancements to simplify generative AI app development and local fine-tuning. Here's what's new:

### New Features and Enhancements

1. **Model Catalog**
   - Windows AI Studio now offers an expanded model catalog powered by Azure ML and Hugging Face. In this release we offer 3 text generation AI models ready to be configured for fine-tuning and inferencing locally.

        - Meta/Llama-2-7b
        - Microsoft/phi-1.5
        - Microsoft/phi-2
        - mistralai/Mistral-7B
        - HuggingFaceH4/zephyr-7b-beta

2. **Prerequisites Check**
   - Before installing Windows AI Studio, the new Prerequisites Check ensures that your system meets the necessary requirements, such as NVIDIA GPUs with minimun 8GB VRAM and recommended 16GB+ VRAM with a compatible WSL Ubuntu distribution installed. This ensures a smooth installation process.

   - Expected times for different GPUs on default Dataset

      | GPU             | Dataset | Time    |
      |-----------------|---------|---------|
      | RTX 3080 Ti Mobile | Default | 52 mins |
      | RTX 4090 | Default |  42 mins |
      | RTX A6000 | Default | 35 mins|
      | RTX ADA5000 Mobile | Default | 49 mins |
      | RTX A6000 ADA | Default | 32 min |
      

3. **Model Fine-tuning**
   - Fine-tuning AI models has never been easier. With Windows AI Studio, you can select a model from the catalog and fine-tune it locally using QLoRA. You can get started with your GitHub account.

4. **Customizable Settings**
   - When fine-tuning a model, you have the flexibility to adjust various settings, including data types, dropout probabilities, batch sizes, and more. Customize the parameters to optimize the fine-tuning process for your specific scenario.

5. **Windows Optimized Models**
   - Discover a collection of publicly available AI models already optimized for Windows. These models are sourced from different locations, including Hugging Face and GitHub, and are ready for download and use in your Windows applications.

6. **Q&A Page**
   - To address common issues and provide resolutions, we have introduced a [FAQ page](https://aka.ms/ai-toolkit/doc-faq). You can refer to this page for solutions to frequently encountered problems.

7. Please see our [documentation](https://aka.ms/ai-toolkit/doc-overview) for more in depth information and walkthrouhgs of the tool.

### Coming Soon

While the current release brings many exciting features, we are also working on the following additions:

- **RAG Project**: Stay tuned for the upcoming RAG Project feature, which will further enhance your AI development capabilities.

- **Phi-2 Model Playground**: Explore the Phi-2 Model Playground, a new feature that will provide an opportunity of using Phi-2 locally directly from the tool.
