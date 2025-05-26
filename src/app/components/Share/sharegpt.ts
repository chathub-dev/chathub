import { ofetch } from 'ofetch'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import supersub from 'remark-supersub'
import { unified } from 'unified'
import { ChatMessageModel } from '~types'

const USER_AVATAR_URI =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 128 128' version='1.1' xmlns='http://www.w3.org/2000/svg' role='img' aria-label='xxlarge'%3E%3Cg%3E%3Ccircle cx='64' cy='64' r='64' fill='%23c1c7d0' /%3E%3Cg%3E%3Cpath fill='%23fff' d='M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z' /%3E%3Cpath fill='%23fff' d='M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A"

interface ShareGPTItem {
  from: string
  value: string
}

async function markdown2html(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(supersub)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)
  return String(file)
}

async function buildItems(messages: ChatMessageModel[]): Promise<ShareGPTItem[]> {
  const items = [
    {
      from: 'system',
      value:
        '<div><small><i>This conversation is shared from <b>HuddleLLM</b></a></i></small></div>',
    },
  ]
  for (const m of messages) {
    if (m.text) {
      items.push({
        from: m.author === 'user' ? 'human' : 'assistant', // Map bot author (number) to 'assistant'
        value: m.author === 'user' ? m.text : await markdown2html(m.text),
      })
    }
  }
  return items
}

export async function uploadToShareGPT(messages: ChatMessageModel[]) {
  const items = await buildItems(messages)
  const resp = await ofetch('https://sharegpt.com/api/conversations', {
    method: 'POST',
    body: {
      avatarUrl: USER_AVATAR_URI,
      items,
    },
  })
  return resp.id as string
}
