# Remote development
After project generation, use the `Relaunch Window in Workspace` option. This opens the generated project locally.

![Generate Complete Open](Images/remote/generate-complete-open.png)

![Opening Project](Images/remote/opening-project.png)

Explore the project structure, including folders like 'finetuning', 'dataset', 'inference', 'infra' and 'setup'. 

![Project Layout](Images/remote/project-layout.png)

The 'infra' folder holds all the necessory configurations for remote operations.

The `./infra/provision/*` files are Bicep files that provision Azure resources like Azure Container App (ACA) and Azure Files.

The `./infra/*.config.json` files are configuration files, created by the provision command and used as input for the other remote command palettes. These command palettes will perform operations based on the Azure resources that have been provisioned and configured in the config file.

## Prerequisites
To run the model fine-tuning or inference in your remote Azure Container App Environment, you need to make sure your subscription have enough GPU capacity amount. Submit a [support ticket](https://azure.microsoft.com/support/create-ticket/) to request the capacity amount required for your application. [Learn More about GPU capacity](https://learn.microsoft.com/en-us/azure/container-apps/workload-profiles-overview)

## Beginning the Fine-Tuning Process
### Provision
To get started, you need provision the Azure Resource for remote fine-tuning. This can be done by running the `Windows AI Studio Tools: Provision Azure Container Apps job for fine-tuning` from command palette. During this process, you will be prompted to select your Azure Subscription and resource group.

![Provision Fine-Tuning](Images/remote/provision-finetune.png)

You can monitor the progress of the provision via the link that is displayed in the output channel.
![Provision Progress](Images/remote/provision-progress.png)

#### Using existing Azure Resources
If you have existing Azure resources that need to be configured for fine-tuning, you can specify their names in the `./infra/finetuning.parameters.json` file and then run the `Windows AI Studio Tools: Provision Azure Container Apps job for fine-tuning` from the command palette. This will update the resources you've specified and create any that are missing.

For example, if you have an existing Azure container environment, your `./infra/finetuning.parameters.json` should look like this:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      ...
      "acaEnvironmentName": {
        "value": "<your-aca-env-name>"
      },
      "acaEnvironmentStorageName": {
        "value": null
      },
      ...
    }
  }
```

#### Manual Configuration
If you prefer to manually set up the Azure resources, you can use the provided bicep files in the `./infra/provision` folders. If you've already set up and configured all the Azure resources without using the Windows AI Studio Visual Studio Code Extension command palette, you can simply enter the resource names in the `finetune.config.json` file.

For example:

```json
{
  "SUBSCRIPTION_ID": "<your-subscription-id>",
  "RESOURCE_GROUP_NAME": "<your-resource-group-name>",
  "STORAGE_ACCOUNT_NAME": "<your-storage-account-name>",
  "FILE_SHARE_NAME": "<your-file-share-name>",
  "ACA_JOB_NAME": "<your-aca-job-name>",
  "COMMANDS": [
    "cd /mount",
    "pip install -r ./setup/requirements.txt",
    "huggingface-cli download <your-model-name> --local-dir ./model-cache/<your-model-name> --local-dir-use-symlinks False",
    "python3 ./finetuning/invoke_olive.py"
  ]
}
```
### Optional: Configuring Secrets for fine-tuning in Azure Container Apps
Azure Container App Secrets offer a secure way to store and manage sensitive data within Azure Container Apps (ACA). This feature fulfills the need for a secure environment to handle sensitive data such as HuggingFace tokens and Weights & Biases API keys. If you need to set these values, Windows AI Studio provides a command palette to input the secrets into the provisioned Azure container app job (as stored in `./finetuning.config.json`). These secrets are then set as **environment variables** in all the containers.

#### How to use:
1. In the Command Palette, type and select `Windows AI Studio Tools: Add Azure Container Apps Job secret for fine-tuning.`
![Add secret](Images/remote/add-secret.png)

1. Input Secret Name and Value: You'll be prompted to input the name and value of the secret.
   ![Input secret name](Images/remote/input-secret-name.png)
   ![Input secret](Images/remote/input-secret.png)
   There are some common secret:
   - [HF_TOKEN](https://huggingface.co/docs/huggingface_hub/package_reference/environment_variables#hftoken): This token is used to authenticate the user to the Hugging Face Hub, removing the need for manual user login. If your project contains datasets or models that need Hugging Face access control, set this value.
   - [WANDB_API_KEY](https://docs.wandb.ai/guides/track/environment-variables#optional-environment-variables): This key is used to access Weights & Biases. If your project has enabled Weights & Biases, set this value.

After you've set up the secret, you can now use it in your Azure Container App. The secret will be set in the environment variables of your container app.

### Execution
To start the remote fine-tuning job, execute the `Windows AI Studio Tools: Run fine-tuning` command.
![Run Fine-tuning](Images/remote/run-finetuning.png)

Upon running this command, the extension will do the following operations:
1. Synchronize your workspace with Azure Files.
1. Start the ACA job using the commands specified in `./infra/fintuning.config.json`.
1. Display the job streaming log if the job has started running. 
    ![Run Log](Images/remote/run-log.png)
    > **Note:** the job might be queued if there are insufficient resources available.
    
During this process, QLoRA will be used for fine-tuning, and will create LoRA adapters for the model to use during inference.
The results of the fine-tuning will be stored in the Azure Files.

## Inferencing with the fine-tuned model
![Fine-tune complete](Images/remote/finetune-res.png)

Now that the adapters are trained in the remote environment, you can use a simple Gradio application to interact with the model.  
   
### Provision
Similar to the fine-tuning process, you need to set up the Azure Resources for remote inference by executing the `Windows AI Studio Tools: Provision Azure Container Apps for inference` from the command palette. During this setup, you will be asked to select your Azure Subscription and resource group.  
![Provision Inference Resource](Images/remote/provision-inference.png)
   
By default, if you select the same resource group as for fine-tuning, the inference will use the same Azure Container App Environment and the same files stored in Azure Files. The Azure Container App will initiate a web API with the command configured in `./infra/provision/inference.parameters.json`  

Once provisioning is successfully completed, you can find the web API endpoint under `ACA_APP_ENDPOINT` within `./infra/inference.config.json`. You are now ready to evaluate the model using this endpoint.


#### Using Existing Azure Resources  
If you have existing Azure resources that need to be set up for inference, you can specify their names in the `./infra/inference.parameters.json` file and then run the `Windows AI Studio Tools: Provision Azure Container Apps for inference` command from the command palette. This will update the resources you've identified and create any that are missing.  
   
#### Manual Setup  
If you prefer to manually configure the Azure resources, you can use the provided bicep files in the `./infra/provision` folders. If you have already set up and configured all the Azure resources without using the Windows AI Studio Visual Studio Code Extension command palette, you can simply enter the resource names in the `inference.config.json` file.

### Modifying the Inference Code  
If you wish to revise the inference code, please execute the `Windows AI Studio Tools: Update code for inference` command. This will synchronize your latest code with ACA and restart the replica.  

![Update code for inference](./Images/remote/update-inference-code.png)
   
