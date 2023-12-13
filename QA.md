# Windows AI Studio Q&A

### Windows AI Studio Preview would not start

Make sure to check for the prerequisites before installing the extension. More details at [Prerequisites](README.md#prerequisites).

### I have the NVIDIA GPU device but the prerequisites check fails

If you have the NVIDIA GPU device but the prerequisites check fails with "GPU is not detected", make sure that the latest driver is installed. You can check and download the driver at [NVIDIA site](https://www.nvidia.com/Download/index.aspx?lang=en-us).

### I generated the project but Conda activate fails to find the environment

There might have been an issue setting the environment you can manually initialize the environment using `bash /mnt/[PROJECT_PATH]/setup/first_time_setup.sh` from inside the workspace.

### When using a Huggin Face dataset how to I get it?

Make sure before you start the `python finetuning/invoke_olive.py` command you run `huggingface-cli login` this will ensure the dataset can be downloaded on your behalf.

### Can I use my own models or other models from Hugging Face?

Not at this time but we are working to expand the list of models.

### Does the extension work in Linux or other systems?

At this time we only support running the extension in Windows we are currently planning for other platform support. The extension uses WSL but will not run within the environment.

### Can I use the extension on an Azure VM?

At this time Azure GPU VMs do not support nested virtualization which is needed to run the WSL environment this will prevent the extension from working.
