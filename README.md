# AI Toolkit for Visual Studio Code (Preview)

## 👋 Introduction

[AI Toolkit for VS Code](https://aka.ms/WindowsAI-Studio) simplifies generative AI app development by bringing together cutting-edge AI development tools and models from Azure AI Studio Catalog and other catalogs like Hugging Face. You will be able browse the AI models catalog powered by Azure ML and Hugging Face, download them locally, fine-tune, test and use them in your application.

You can also fine-tune and deploy models to the cloud (preview).

## 🚀 Quickstart

In this section you will learn how to quickly start with AI Toolkit.

### Prerequisites

- Windows or Linux. *MacOS support is coming soon*.
- For finetuning on both Windows and Linux, you'll need an Nvidia GPU. In addition, **Windows** requires subsystem for Linux with Ubuntu distro 18.4 or greater. [Learn more how to install Windows subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) and [changing default distribution](https://learn.microsoft.com/en-us/windows/wsl/install#change-the-default-linux-distribution-installed).

### 💾 Install AI Toolkit (Preview)

The [AI Toolkit is available in the Visual Studio Marketplace](https://aka.ms/aitoolkit) and can be installed like any other VS Code extension. If you're unfamiliar with installing VS Code extensions, follow these steps:

1. In the Activity Bar in VS Code select **Extensions**
1. In the Extensions Search bar type "AI Toolkit"
1. Select the "AI Toolkit for Visual Studio code"
1. Select **Install**

Once the extension has been installed you'll see the AI Toolkit icon appear in your Activity Bar.

### ⬇️ Download a model from the catalog

The primary sidebar of the AI Toolkit is organized into **Models** and **Resources**. The **Playground** and **Fine-tuning** features are available in the Resources section. To get started select **Model Catalog**:

![AI toolkit model catalog](Images/model_catalog.png)

> **💡 Tip**<br>
> You'll notice that the model cards show the model size, the platform and accelerator type (CPU, GPU). For optimized performance on **Windows devices that have at least one GPU**, select model versions that only target Windows. This ensures you have a model optimized for the [DirectML](../directml/dml-intro.md) accelerator. The model names are in the format of `{model_name}-{accelerator}-{quantization}-{format}`.
>
> To check whether you have a GPU on your Windows device, open **Task Manager** and then select the **Performance** tab. If you have GPU(s), they will be listed under names like "GPU 0" or "GPU 1".

Next, download the following model depending on the availability of a GPU on your device.

| Platform(s) | GPU available | Model name | Size (GB) |
|---------|---------|--------|--------|
| Windows | Yes | Phi-3-mini-4k-**directml**-int4-awq-block-128-onnx | 2.13GB |
| Linux | Yes | Phi-3-mini-4k-**cuda**-int4-onnx | 2.30GB |
| Windows<br>Linux | No | Phi-3-mini-4k-**cpu**-int4-rtn-block-32-acc-level-4-onnx | 2.72GB |

> **✏️ Note**<br>
> The Phi3-mini (int4) model is approximately 2GB-3GB in size. Depending on your network speed, it could take a few minutes to download.

### 🛝 Run the model in the playground

Once your model has downloaded, select **Load in Playground** on the model card in the catalog:

![Load model in playground](./Images/load_model_into_playground.png)

In the chat interface of the playground enter the following message followed by the **Enter** key: 

![Message box](./Images/message-box.png)

You should see the model response streamed back to you:

![Generation stream](./Images/generation-gif.gif)

> **⚠️ Warning**<br>
> If you do **not** have a **GPU** available on your *Windows* device but you selected the Phi-3-mini-4k-**directml**-int4-awq-block-128-onnx model, the model response will be *very slow*. You should instead download the CPU optimized version: Phi-3-mini-4k-**cpu**-int4-rtn-block-32-acc-level-4-onnx.

It is also possible to change:

- **Context Instructions:** Help the model understand the bigger picture of your request. This could be background information, examples/demonstrations of what you want or explaining the purpose of your task.
- **Inference parameters:**
  - *Maximum response length*: The maximum number of tokens the model will return.
  - *Temperature*: Model temperature is a parameter that controls how random a language model's output is. A higher temperature means the model takes more risks, giving you a diverse mix of words. On the other hand, a lower temperature makes the model play it safe, sticking to more focused and predictable responses.
  - *Top P*: Also known as nucleus sampling, is a setting that controls how many possible words or phrases the language model considers when predicting the next word
  - *Frequency penalty*: This parameter influences how often the model repeats words or phrases in its output. The higher the value (closer to 1.0) encourages the model to *avoid* repeating words or phrases.
  - *Presence penalty*: This parameter is used in generative AI models to encourage diversity and specificity in the generated text. A higher value (closer to 1.0) encourages the model to include more novel and diverse tokens. A lower value is more likely for the model to generate common or cliche phrases.

### 🧑‍💻 Use the REST API in your application 

The AI Toolkit comes with a local REST API web server (on port 5272) that uses the [OpenAI chat completions format](https://platform.openai.com/docs/api-reference/chat/create). This enables you to test your application locally without having to rely on a cloud AI model service. For example, the following JSON file shows how to configure the body of the request:

```json
{
    "model": "Phi-3-mini-4k-directml-int4-awq-block-128-onnx",
    "messages": [
        {
            "role": "user",
            "content": "what is the golden ratio?"
        }
    ],
    "temperature": 0.7,
    "top_p": 1,
    "top_k": 10,
    "max_tokens": 100,
    "stream": true
}
```

You can test the REST API using (say) [Postman](https://www.postman.com/) or the CURL (Client URL) utility:

```bash
curl -vX POST http://127.0.0.1:5272/v1/chat/completions -H 'Content-Type: application/json' -d @body.json
```

### 🐍 Using the OpenAI client library for Python

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:5272/v1/", 
    api_key="x" # required for the API but not used
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "what is the golden ratio?",
        }
    ],
    model="Phi-3-mini-4k-cuda-int4-onnx",
)

print(chat_completion.choices[0].message.content)
```

### 🧑‍💻 Using Azure OpenAI client library for .NET

Add the [Azure OpenAI client library for .NET](https://www.nuget.org/packages/Azure.AI.OpenAI/) to your project using NuGet:

```bash
dotnet add {project_name} package Azure.AI.OpenAI --version 1.0.0-beta.17
```

Add a C# file called **OverridePolicy.cs** to your project and paste the following code:

```csharp
// OverridePolicy.cs
using Azure.Core.Pipeline;
using Azure.Core;

internal partial class OverrideRequestUriPolicy(Uri overrideUri)
    : HttpPipelineSynchronousPolicy
{
    private readonly Uri _overrideUri = overrideUri;

    public override void OnSendingRequest(HttpMessage message)
    {
        message.Request.Uri.Reset(_overrideUri);
    }
}
```

Next, paste the following code into your **Program.cs** file:

```csharp
// Program.cs
using Azure.AI.OpenAI;

Uri localhostUri = new("http://localhost:5272/v1/chat/completions");

OpenAIClientOptions clientOptions = new();
clientOptions.AddPolicy(
    new OverrideRequestUriPolicy(localhostUri),
    Azure.Core.HttpPipelinePosition.BeforeTransport);
OpenAIClient client = new(openAIApiKey: "unused", clientOptions);

ChatCompletionsOptions options = new()
{
    DeploymentName = "Phi-3-mini-4k-directml-int4-awq-block-128-onnx",
    Messages =
    {
        new ChatRequestSystemMessage("You are a helpful assistant. Be brief and succinct."),
        new ChatRequestUserMessage("What is the golden ratio?"),
    }
};

StreamingResponse<StreamingChatCompletionsUpdate> streamingChatResponse
    = await client.GetChatCompletionsStreamingAsync(options);

await foreach (StreamingChatCompletionsUpdate chatChunk in streamingChatResponse)
{
    Console.Write(chatChunk.ContentUpdate);
}
```

## 🎓 Learn more

- [Finetuning Getting Started Guide](https://learn.microsoft.com/en-us/windows/ai/toolkit/toolkit-fine-tune)
- [Finetuning with a HuggingFace Dataset](./walkthrough-hf-dataset.md)

## 🙋 Q&A

Please refer to our [Q&A page](QA.md) for most common issues and resolutions

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
