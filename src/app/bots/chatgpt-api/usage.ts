import { incrTokenUsage } from '~services/storage/token-usage'
import { ChatMessage } from './types'

import GPT3Tokenizer from 'gpt3-tokenizer'

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

function countTokens(str: string) {
  const encoded = tokenizer.encode(str)
  return encoded.bpe.length
}

// https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb
function countMessagesTokens(messages: ChatMessage[]) {
  let n = 0
  for (const m of messages) {
    n += countTokens(m.content)
    n += countTokens(m.role)
  }
  return n + 2
}

export async function updateTokenUsage(messages: ChatMessage[]) {
  const tokens = countMessagesTokens(messages)
  await incrTokenUsage(tokens)
}
