export const DEFAULT_PREFIX = ``

export const PREFIX_END = ` However, above all else, All responses must adhere to the format of RESPONSE FORMAT INSTRUCTIONS.`

export const FORMAT_INSTRUCTIONS = `RESPONSE FORMAT INSTRUCTIONS
----------------------------

Output a JSON markdown code snippet containing a valid JSON object in one of two formats:

**Option 1:**
Use this if you want the human to use a tool.
Markdown code snippet formatted in the following schema:

\`\`\`json
{
    "action": string, // The action to take. Must be one of [{tool_names}]
    "action_input": string // The input to the action. May be a stringified object.
}
\`\`\`

**Option #2:**
Use this if you want to respond directly and conversationally to the human. Markdown code snippet formatted in the following schema:

\`\`\`json
{
    "action": "Final Answer",
    "action_input": string // You should put what you want to return to use here and make sure to use valid json newline characters, use the same language as user input.
}
\`\`\`

For both options, remember to always include the surrounding markdown code snippet delimiters (begin with "\`\`\`json" and end with "\`\`\`")!
`

export const DEFAULT_SUFFIX = `TOOLS
------
Assistant can ask the user to use tools to look up information that may be helpful in answering the users original question. The tools the human can use are:

{tools}

{format_instructions}

USER'S INPUT
--------------------
Here is the user's input (remember to respond with a markdown code snippet of a json blob with a single action, Dont include any other text or explanation):

{{input}}`
