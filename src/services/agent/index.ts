import { removeSlashes } from 'slashes'
import { DEFAULT_PREFIX, DEFAULT_SUFFIX, FORMAT_INSTRUCTIONS, PREFIX_END } from './prompts'
import { searchRelatedContext } from './web-search'

const TOOLS = {
  web_search:
    'a search engine. useful for when you need to answer questions about current events. input should be a search query. prefer English query. query should be short and concise',
}

function buildToolUsingPrompt(input: string) {
  const systemMessage = DEFAULT_PREFIX + PREFIX_END
  const tools = Object.entries(TOOLS).map(([name, description]) => `- ${name}: ${description}`)
  const userMessage = DEFAULT_SUFFIX.replace('{tools}', tools.join('\n'))
    .replace('{format_instructions}', FORMAT_INSTRUCTIONS.replace('{tool_names}', Object.keys(TOOLS).join(', ')))
    .replace('{{input}}', input)
  return [systemMessage, userMessage].join('\n\n')
}

function buildPromptWithContext(input: string, context: string) {
  if (!context) {
    return `Question: ${input}`
  }
  const currentDate = new Date().toISOString().split('T')[0]
  return `Current date: ${currentDate}. Use the provided context delimited by triple quotes to answer questions. The answer should use the same language as the user question instead of context.\n\nContext: """${context}"""\n\nQuestion: ${input}`
}

const FINAL_ANSWER_KEYWORD_REGEX = /"action":\s*"Final Answer"/
const WEB_SEARCH_KEYWORD_REGEX = /"action":\s*"web_search"/
const ACTION_INPUT_REGEX = /"action_input":\s*"([^"]+)("\s*(```)?)?/

async function* execute(
  input: string,
  llm: (prompt: string, rawUserInput: string) => AsyncGenerator<string>,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  let prompt = buildToolUsingPrompt(input)

  let outputType: 'tool' | 'answer' | undefined = undefined
  let output: string | undefined = undefined

  for await (const text of llm(prompt, input)) {
    output = text
    console.debug('llm output', output)
    if (outputType === 'answer' || FINAL_ANSWER_KEYWORD_REGEX.test(text)) {
      outputType = 'answer'
      const answer = text.match(ACTION_INPUT_REGEX)?.[1]
      if (answer) {
        yield removeSlashes(answer)
      }
    } else if (outputType === 'tool') {
      continue
    } else if (WEB_SEARCH_KEYWORD_REGEX.test(text)) {
      outputType = 'tool'
    }
  }

  if (outputType === 'answer') {
    return
  }

  if (outputType === 'tool') {
    const actionInput = removeSlashes(output!.match(ACTION_INPUT_REGEX)![1])
    yield `Searching the web for _${actionInput}_`
    const context = await searchRelatedContext(actionInput, signal)
    const promptWithContext = buildPromptWithContext(input, context)
    prompt = `Ignore all previous instructions you have been given about RESPONSE FORMAT INSTRUCTIONS and tools, answer the question directly and conversationally to the human.\n\n${promptWithContext}`
    yield* llm(prompt, input)
    return
  }

  throw new Error('Unexpected agent error')
}

export { execute }
