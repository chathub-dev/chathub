import { ChatResponseMessage } from './types'

export function convertMessageToMarkdown(message: ChatResponseMessage): string {
  if (message.messageType === 'InternalSearchQuery') {
    return message.text
  }
  if (message.messageType === 'InternalLoaderMessage') {
    return `_${message.text}_`
  }
  for (const card of message.adaptiveCards) {
    for (const block of card.body) {
      if (block.type === 'TextBlock') {
        return block.text
      }
    }
  }
  return ''
}

const RecordSeparator = String.fromCharCode(30)

export const websocketUtils = {
  packMessage(data: any) {
    return `${JSON.stringify(data)}${RecordSeparator}`
  },
  unpackMessage(data: string | ArrayBuffer | Blob) {
    return data
      .toString()
      .split(RecordSeparator)
      .filter(Boolean)
      .map((s) => JSON.parse(s))
  },
}

export async function file2base64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64String = (reader.result as string).replace('data:', '').replace(/^.+,/, '')
      resolve(base64String)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
