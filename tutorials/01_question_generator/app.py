"""Run this model in Python

> pip install azure-ai-inference
"""
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import AssistantMessage, SystemMessage, UserMessage
from azure.ai.inference.models import ImageContentItem, ImageUrl, TextContentItem
from azure.core.credentials import AzureKeyCredential

def chat(user_query):
    # To authenticate with the model you will need to generate a personal access token (PAT) in your GitHub settings.
  # Create your PAT token by following instructions here: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
    client = ChatCompletionsClient(
        endpoint = "https://models.inference.ai.azure.com",
        credential = AzureKeyCredential(os.environ["GITHUB_TOKEN"]),
        api_version = "2024-08-01-preview",
    )

    response = client.complete(
        messages = [
            SystemMessage(content = "Generate one educational question for students"),
            UserMessage(content = [
                TextContentItem(text = user_query),
            ]),
        ],
        model = "gpt-4o",
        response_format = "text",
        max_tokens = 4096,
        temperature = 1,
        top_p = 1,
    )

    print(response.choices[0].message.content)

def main():
    print("Enter your query (type 'exit' to quit):")
    
    while True:
        user_input = input("> ")
        
        if user_input.lower() == 'exit':
            break
            
        try:
            chat(user_input)
        except Exception as e:
            print(f"\nError: {str(e)}")

if __name__ == "__main__":
    main()