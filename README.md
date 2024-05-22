# AI Toolkit for Visual Studio Code Preview

## Overview

[AI Toolkit for VS Code](https://aka.ms/WindowsAI-Studio) simplifies generative AI app development by bringing together cutting-edge AI development tools and models from Azure AI Studio Catalog and other catalogs like Hugging Face. You will be able browse the AI models catalog powered by Azure ML and Hugging Face, download them locally, fine-tune, test and use them in your application.

You can also fine-tune and deploy models to the cloud (preview).

## Quick Start

In this section you will learn how to quickly start with AI Toolkit.

### Prerequisites

AI Toolkit Preview will run locally. Depends on the model you selected, some tasks have Windows and Linux support only, MacOS support is coming soon. For local inference or fine-tune, depends on the model you selected, you may need to have GPU such as NVIDIA GPUs for the preview. If you run remotely the cloud resource needs to have GPU, please make sure to check your environment. For local run on Windows + WSL, WSL Ubuntu distro 18.4 or greater should be installed and is set to default prior to using AI Toolkit.
[Learn more how to install Windows subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) and [changing default distribution](https://learn.microsoft.com/en-us/windows/wsl/install#change-the-default-linux-distribution-installed).

### Install AI Toolkit Preview

AI Toolkit is shipped as a [Visual Studio Code Extension](https://code.visualstudio.com/docs/setup/additional-components#_vs-code-extensions), so you need to install [VS Code](https://code.visualstudio.com/docs/setup/windows) first, and download AI Toolkit from the [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-windows-ai-studio.windows-ai-studio).

### Sign In

Now, you are ready to use the extension!
You will be prompted to sign in to GitHub, so please click "Allow" to continue. You will be redirected to GitHub signing page.
Please sign in and follow the process steps. After successful completion, you will be redirected to VS Code.

Let's explore the available actions!

### Available Actions

Upon launching AI Toolkit from VS Code side bar, you can select from the following options:

- Find a supported model from **Model Catalog** and download locally
- Test model inference in the **Model Playground**
- Fine-tune model locally or remotely in **Model Fine-tuning**
- Deploy fine-tuned models to cloud via command palette for AI Toolkit

### Model Fine-tuning

To initiate the local fine-tuning session using QLoRA, select a model you want to fine-tune from our catalog.

> **_Note_** You do not need an Azure Account to download the models

Start by selecting a project name and location.
Next, select a model from the model catalog. You will be prompted to download the project template. You can then click "Configure Project" to adjust various settings.
We use [Olive](https://microsoft.github.io/Olive/overview/olive.html) to run QLoRA fine-tuning on a PyTorch model from our catalog. All of the settings are preset with the default values to optimize to run the fine-tuning process locally with optimized use of memory, but it can be adjusted for your scenario.

After all the parameters are set, click **Generate Project**.
This will:

- Initiate the model download
- Install all prerequisites and dependencies
- Create VS Code workspace

When the model is downloaded, you can launch the project from AI Toolkit.

> ***Note*** If you want to try preview feature to do inference or fine-tuning remotely, please follow [this guide](https://aka.ms/previewFinetune)

### Windows Optimized Models

AI Toolkit offers the collection of publicly available AI models already optimized for Windows. The models are stored in the different locations including Hugging Face, GitHub and others, but you can browse the models and find all of them in one place ready for downloading and using in your Windows application.

### Q&A

Please refer to our [Q&A page](QA.md) for most common issues and resolutions

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
