# Data Generator

The Data Generator is a powerful feature in the Prompt Builder that helps you create high-quality data for your prompt templates. It analyzes your prompt structure and variables to generate realistic test cases that match your expected use cases.

## How It Works

1. The generator analyzes your prompt template and identifies variables
2. It examines any provided example test cases
3. Plans appropriate test data based on variable analysis
4. Generates new test cases that are both realistic and distinct from examples

## Meta Prompt Structure

The backend uses a structured meta prompt template. Here's the core structure:

```
<Prompt Template>
{{{inputPrompt}}}
</Prompt Template>
    
Your job is to construct a test case for the prompt template above. This template contains "variables", which are placeholders to be filled in later. In this case, the variables are:

<variables>
[Variable names]
</variables>

Here are the example test cases provided by the user.
[Examples section if provided]

First, in <planning> tags, do the following:
    
1. Summarize the prompt template. What is the goal of the user who created it?
2. For each variable in <variables>, carefully consider what a paradigmatic, realistic example of that variable would look like. You'll want to note who will be responsible "in prod" for supplying values. Written by a human "end user"? Downloaded from a website? Extracted from a database? Think about things like length, format, and tone in addition to semantic content. Use the examples provided by the user to guide this exercise. The goal is to acquire a sense of the statistical distribution the examples are being drawn from. The example you write should be drawn from that same distribution, but suffici
ently different from the examples that it provides additional signal. A tricky balancing act, but I have faith in you.
    
Once you're done, output a test case for this prompt template with a full, complete, value for each variable. The output format should consist of a tagged block for each variable, with the value inside the block, like the below:

<planning>
1. Summary of the prompt template:
[Summary of the prompt template]
2. Consideration of variables:
[Describe what a paradigmatic, realistic example of that variables would look like]
</planning>

Output Format:
<variables>
<sample-var>
[a full, complete, value for the variable "sample-var". (You do not need to repeat the variable name inside the tags.)]
</sample-var>
</variables>
```
