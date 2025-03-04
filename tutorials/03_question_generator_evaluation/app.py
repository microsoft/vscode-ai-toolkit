"""Run this model in Python

> pip install azure-ai-inference
"""
import os
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import AssistantMessage, SystemMessage, UserMessage
from azure.ai.inference.models import ImageContentItem, ImageUrl, TextContentItem
from azure.ai.inference.models import JsonSchemaFormat
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
            SystemMessage(content = "Generate a question on a specified topic and provide a question, answer, and a series of increasingly specific hints to guide students toward arriving at the correct answer.\n\n# Guidelines\n\n- Ensure the question is clear and suitable for the intended level of the students.\n- Provide hints gradually, starting with broad clues and narrowing down to specific ones.\n- Confirm that the answer aligns perfectly with the question and hints.\n- Only one question should be generated per request.\n\n# Steps\n\n1. **Formulate the Question**: Develop a unique, engaging question for the specified topic. Ensure the question is educational and contextually relevant.\n2. **Provide the Answer**: Identify the correct answer to the question.\n3. **Create Hints**: \n   - Hint 1: A broad or general clue related to the topic.\n   - Hint 2: A more specific clue designed to guide the student closer to the answer.\n   - Hint 3: A precise clue that makes the answer more apparent without directly stating it.\n\n# Examples\n\n# Examples\n### Example 1: Topic - Astronomy\n{\n  \"topic\": \"Astronomy\",\n  \"question\": \"What is the largest planet in the Solar System?\",\n  \"answer\": \"Jupiter\",\n  \"hints\": [\n    \"This planet is known for its massive size and its many moons.\",\n    \"It is a gas giant located between Mars and Saturn.\",\n    \"It has a famous Great Red Spot, a giant storm visible from Earth.\"\n  ]\n}\n\n### Example 2: Topic - Mathematics\n{\n  \"topic\": \"Mathematics\",\n  \"question\": \"What is the smallest prime number?\",\n  \"answer\": \"2\",\n  \"hints\": [\n    \"It is the first even number in the list of prime numbers.\",\n    \"A prime number can only be divided by 1 and itself, and this number is less than 3.\",\n    \"It is the only even number that is also a prime.\"\n  ]\n}\n\n### Example 3: Topic - Chemical Thermodynamics\n{\n  \"topic\": \"Chemical Thermodynamics\",\n  \"question\": \"A reaction has a ΔG° = -45.0 kJ/mol at 298 K. What is the equilibrium constant (K) for this reaction? R = 8.314 J/(mol·K).\",\n  \"answer\": \"Approximately 3.9 × 10^7\",\n  \"hints\": [\n    \"Recall the relationship between the standard Gibbs free energy change (ΔG°) and the equilibrium constant (K): ΔG° = -RT ln K.\",\n    \"Substitute the values: R = 8.314 J/(mol·K), T = 298 K, ΔG° = -45.0 × 10^3 J/mol. Rearrange the formula to solve for K.\",\n    \"Solve: First, calculate ln K = -ΔG°/(RT). Then take the exponential of the result using K = e^ln K. After calculations, you should find K ≈ 3.9 × 10^7.\"\n  ]\n}\n\n# Notes\n- Ensure that the hints do not directly reveal the answer but rather guide the student logically toward it.\n- Questions should vary across disciplines like biology, physics, chemistry, mathematics, history, literature, and other educational subjects unless otherwise specified."),
            UserMessage(content = [
                TextContentItem(text = "Generate a challenge physics question about Newton's laws of motion for high school students"),
            ]),
            AssistantMessage(content = "{\n  \"answer\": \"5 m/s^2\",\n  \"hints\": [\n    \"Newton's Second Law states F = ma.\",\n    \"The net force acting on the block is the applied force minus the frictional force. Calculate the net force first.\",\n    \"The frictional force is given by μN, where N is the normal force equal to the weight of the block. Use F_net = ma to find the acceleration.\"\n  ],\n  \"question\": \"A 2 kg block is pulled across a horizontal surface by a force of 20 N. If the coefficient of kinetic friction between the block and the surface is 0.5, what is the acceleration of the block?\",\n  \"topic\": \"Physics - Newton's Laws of Motion\"\n}"),
            UserMessage(content = [
                TextContentItem(text = user_query),
            ]),
        ],
        model = "gpt-4o",
        response_format = JsonSchemaFormat(
            name = "Question_Generator",
            description = "",
            strict = True,
            schema = {
                "type": "object",
                "description": "Schema for educational questions with hints and answers",
                "properties": {
                    "topic": {
                        "type": "string",
                        "description": "The academic subject of the question"
                    },
                    "question": {
                        "type": "string",
                        "description": "The educational question to be answered"
                    },
                    "answer": {
                        "type": "string",
                        "description": "The correct answer to the question"
                    },
                    "hints": {
                        "type": "array",
                        "description": "List of progressive hints to help solve the question",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                "required": [
                    "topic",
                    "answer",
                    "question",
                    "hints"
                ],
                "additionalProperties": False
            }
        ),
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