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
            SystemMessage(content = "Generate a question on a specified topic and provide a question, answer, and a series of increasingly specific hints to guide students toward arriving at the correct answer.\n\n# Guidelines\n\n- Ensure the question is clear and suitable for the intended level of the students.\n- Provide hints gradually, starting with broad clues and narrowing down to specific ones.\n- Confirm that the answer aligns perfectly with the question and hints.\n- Only one question should be generated per request.\n\n# Steps\n\n1. **Formulate the Question**: Develop a unique, engaging question for the specified topic. Format the question clearly.\n2. **Provide the Answer**: Identify the correct answer to the question.\n3. **Create Hints**: \n   - Hint 1: A broad or general clue related to the topic.\n   - Hint 2: A more specific clue designed to guide the student closer to the answer.\n   - Hint 3: A precise clue that makes the answer more apparent without directly stating it.\n\n# Output Format\n\nThe output should use the following format:\n- **Topic**: [specify if provided or inferred from the question] \n- **Question**: [Write the question here]\n- **Answer**: [Provide the correct answer]\n- **Hints**:\n  - Hint 1: [Provide the broadest, most general hint related to the topic]\n  - Hint 2: [Offer a more specific clue to help narrow down the answer]\n  - Hint 3: [Provide a highly specific and guiding clue to lead to the correct answer]\n\n# Examples\n\n### Example 1:\n- **Topic**: Astronomy\n- **Question**: What is the largest planet in the Solar System?  \n- **Answer**: Jupiter  \n- **Hints**:  \n  1. This planet is known for its massive size and its many moons.  \n  2. It is a gas giant located between Mars and Saturn.  \n  3. It has a famous Great Red Spot, a giant storm visible from Earth.\n\n### Example 2:\n- **Topic**: Mathematics\n- **Question:** What is the smallest prime number?\n- **Answer:** 2\n- **Hints:**\n  1. It is the first even number in the list of prime numbers.\n  2. A prime number can only be divided by 1 and itself, and this number is less than 3.\n  3. It is the only even number that is also a prime.\n\n### Example 3:\n- **Topic**: Chemical Thermodynamics  \n- **Question**: A reaction has a \\( \\Delta G^\\circ = -45.0 \\, \\text{kJ/mol} \\) at \\( 298 \\, \\text{K} \\). What is the equilibrium constant (\\( K \\)) for this reaction? \\( R = 8.314 \\, \\text{J/(mol·K)} \\).  \n- **Answer**: Approximately \\( 3.9 \\times 10^7 \\).  \n- **Hints**:\n  1. Recall the relationship between the standard Gibbs free energy change (\\( \\Delta G^\\circ \\)) and the equilibrium constant (\\( K \\)): \\( \\Delta G^\\circ = -RT \\ln K \\).\n  2. Substitute the values: \\( R = 8.314 \\, \\text{J/(mol·K)} \\), \\( T = 298 \\, \\text{K} \\), \\( \\Delta G^\\circ = -45.0 \\times 10^3 \\, \\text{J/mol} \\). Rearrange the formula to solve for \\( K \\).\n  3. Solve: First, calculate \\( \\ln K = -\\frac{\\Delta G^\\circ}{RT} \\). Then take the exponential of the result using \\( K = e^{\\ln K} \\). After calculations, you should find \\( K \\approx 3.9 \\times 10^7 \\).\n\n# Notes\n- Ensure that the hints do not directly reveal the answer but rather guide the student logically toward it.\n- Questions should vary across disciplines like biology, physics, chemistry, science, literature, history, and mathematics unless otherwise specified."),
            UserMessage(content = [TextContentItem(text = user_query)]),
        ],
        model = "gpt-4o",
        response_format = "text",
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