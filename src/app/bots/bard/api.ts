import { ofetch } from 'ofetch'
import { ChatError, ErrorCode } from '~utils/errors'

function extractFromHTML(variableName: string, html: string) {
  const regex = new RegExp(`"${variableName}":"([^"]+)"`)
  const match = regex.exec(html)
  return match?.[1]
}

export async function fetchRequestParams() {
  const html = await ofetch('https://bard.google.com/faq')
  const atValue = extractFromHTML('SNlM0e', html)
  const blValue = extractFromHTML('cfb2h', html)
  return { atValue, blValue }
}

export function parseBardResponse(resp: string) {
  const data = JSON.parse(resp.split('\n')[3])
  const payload = JSON.parse(data[0][2])
  if (!payload) {
    throw new ChatError('Failed to access Bard', ErrorCode.BARD_EMPTY_RESPONSE)
  }
  console.debug('bard response payload', payload)

  let text = payload[4][0][1][0] as string

  const images = payload[4][0][4] || []
  for (const image of images) {
    const [media, source, placeholder] = image
    text = text.replace(placeholder, `[![${media[4]}](${media[0][0]})](${source[0][0]})`)
  }

  return {
    text,
    ids: [...payload[1], payload[4][0][0]] as [string, string, string],
  }
}
